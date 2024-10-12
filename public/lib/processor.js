class AudioProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (input) {
            const channelData = input[0]; // チャンネルのデータ
            this.port.postMessage(channelData); // メッセージをメインスレッドに送る
        }
        return true; // 継続処理を示す
    }
}

registerProcessor('audio-processor', AudioProcessor);