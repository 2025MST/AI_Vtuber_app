from flask import Flask, request
from flask_socketio import SocketIO
import requests
import json
import wave
import os

app = Flask(__name__)
socketio = SocketIO(app, async_mode="eventlet")
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../public")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "Vtuber_speech.wav")
HOST = "127.0.0.1"
VOICE_VOX_PORT = 50021

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

    ai_message = "わしの声聞こえておるかの？" # AIによるテキスト生成ロジックを行う。
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
