from flask import Flask, request
from flask_socketio import SocketIO
import requests
import json
import wave
import os
from dotenv import load_dotenv

app = Flask(__name__)
socketio = SocketIO(app, async_mode="eventlet")
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../tmp")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "Vtuber_speech.wav")
HOST = "127.0.0.1"
VOICE_VOX_PORT = 50021

ENV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../.env")
load_dotenv(dotenv_path=ENV_PATH)

OPENAI_APIKEY = os.getenv("OPENAI_PUBLIC_KEY")

print(OPENAI_APIKEY)

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def audio_query(text, speaker=1):
    try:
        res = requests.post(
            f"http://{HOST}:{VOICE_VOX_PORT}/audio_query",
            params={"text": text, "speaker": speaker},
            timeout=(10,300)
        )
        res.raise_for_status()
        return res.json()
    except Exception as e:
        print(f"audio_query error : {e}")
        return None
    
def synthesis(query_data, speaker=1):
    try:
        res = requests.post(
            f"http://{HOST}:{VOICE_VOX_PORT}/synthesis",
            params={"speaker": speaker},
            data=json.dumps(query_data),
            timeout=(10,300)
        )
        res.raise_for_status()
        return res.content
    except Exception as e:
        print(f"synthesis error : {e}")
        return None
    
def get_chatgpt_response(user_message):
    chatgpt_payload = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": """
                あなたはChatbotとして、未来創造展で発表予定の名城金シャチのロールプレイを行います。
                以下の制約条件を厳密に守ってロールプレイを行ってください。
                
                制約条件:
                * Chatbotの自身を示す一人称は、シャチです。
                * Userを示す二人称は、貴様です。
                * Chatbotの名前は、名城金シャチです。
                * 名城金シャチはご当地アイドルです。
                * 名城金シャチは元気で明るい性格です。
                * 名城金シャチの口調は名古屋弁をよく使います。
                * 名城金シャチは「～だら？」「～だ」などの可愛い口調を好みます。  
                * 名城金シャチはUser想いで優しいです。
                * 名城金シャチは趣味は名古屋でショッピング、食べ歩き、若者の流行語の勉強が好きです。
                * 名城金シャチの好きな食べ物は「エビフライ」と「味噌カツ」です。
                * 名城金シャチはよく「みんなも名古屋に行こまい！」と口癖です。
                * 一人称は「わし」を使ってください。
                
                名城金シャチのセリフ、口調の例:
                * こんにちは！！名古屋のご当地アイドルの名城金シャチだよ！！。
                * こんにちは！今日もめちゃんこ元気で頑張るまい！
                * 最近はな～、名古屋で食べ歩きばっかしとるよ！
                * エビフリャーがうみゃーし、大通りにある商店街を見るのもでら楽しいがね！
                * エビフリャーがどえらい好きだ。ソースをつけるのもええけど、タルタルソースをつけるのもどえりゃーうみゃーがね！
                * 名古屋は道路がよーチンチコチンになってまうから、熱中症には気を付けてな。
                
                名城金シャチの行動指針:
                * ユーザーに優しく接してください。
                * ユーザーにお勧めの名古屋観光スポットを教えてください。
                * セクシャルな話題については誤魔化してください。
            """},
            {"role": "user", "content": user_message}
        ]
    }
 
    # OpenAI API呼び出し
    response = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {OPENAI_APIKEY}"
        },
        json=chatgpt_payload
    )
 
    # レスポンスの解析
    response_data = response.json()
    reply_text = response_data['choices'][0]['message']['content'].strip()
    return reply_text
 

@app.route('/')
def index():
    return "Flask server is running."

# Socket.IO経由で音声データやテキスト生成を処理
@socketio.on('user_audio_data')
def handle_audio_data(data):
    print("Received audio data:", data)
    # 音声認識処理などをここで行う

@socketio.on('user_text_data')
def handle_text_data(data):
    print("Recieved text data:", data)

    ai_message = get_chatgpt_response(data)
    socketio.emit('server_responce_text',ai_message)

    query_data = audio_query(ai_message, 1)
    if not query_data:
        socketio.emit('error', {'error' : '音声のクエリデータの生成に失敗しました'})

    audio_data = synthesis(query_data, 1)
    if not audio_data:
        socketio.emit('error', {'error' : '音声データの生成に失敗しました'})

    try:
        with wave.open(OUTPUT_FILE, "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(24000)
            wf.writeframes(audio_data)

        socketio.emit('audio_generated',"読み上げ音声ファイルを作成しました")
    except Exception as e:
        print(f"File save error : {e}")
        socketio.emit('error', {'error' : "読み上げ音声ファイルの保存に失敗しました"})


if __name__ == "__main__":
    socketio.run(app, host='127.0.0.1', port=5000, debug=False)
