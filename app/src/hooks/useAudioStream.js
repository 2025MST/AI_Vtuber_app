import React, {useRef, useEffect} from 'react';

export const useAudioStream = ({socket, selectedDeviceId, isMuted}) => {

    const aduioStreamRef = useRef(null);

    useEffect(() => {

        if (isMuted || !selectedDeviceId) {
            return ;
        }

        const getAudioStream = async () => {
            try {
                //ブラウザから音声データのストリームデータを取得
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        deviceId: selectedDeviceId ? { exact : selectedDeviceId } : undefined,
                    }
                });

                //?
                const audioContext = new AudioContext();
                const source = audioContext.createMediaStreamSource(stream);
                const processor = audioContext.createScriptProcessor(1024,1,1);

                source.connect(processor);
                processor.connect(audioContext.destination);

                processor.onaudioprocess = (event) => {
                    const audioData = event.inputBuffer.getChannelData(0);
                    socket.emit('audio_stream', audioData); //サーバーに送信
                }
                //?
            } catch (err) {
                console.error("Error accessing audio device : ", err);
            }
        }

        getAudioStream();

        return () => {
            if (aduioStreamRef.current) {
                aduioStreamRef.current.getTracks().forEach((track) => track.stop());
            }
        }

    },[socket, selectedDeviceId, isMuted]);

    return;
}