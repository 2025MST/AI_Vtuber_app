from flask import Flask, request
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app, async_mode="eventlet")

@app.route('/')
def index():
    return "Flask server is running."

# Socket.IO経由で音声データやテキスト生成を処理
@socketio.on('audio_data')
def handle_audio_data(data):
    print("Received audio data:", data)
    # 音声認識処理などをここで行う

if __name__ == "__main__":
    socketio.run(app, host='127.0.0.1', port=5000, debug=False)
