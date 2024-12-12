import { useState, useEffect } from 'react';

export const useMicDetection = (isMicOn, isLoaded, isSpeech, onRecognized) => {
    const [interimText, setInterimText] = useState('');
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {

        if(window.webkitSpeechRecognition === null) {
            console.log("Speechないよ");
        }else{
            console.log("あるよ");
        }

        const speechRecognition = new ( window.webkitSpeechRecognition || window.SpeechRecognition)();
        speechRecognition.lang = 'ja-JP';
        speechRecognition.interimResults = true;

        speechRecognition.onresult = (event) => {
            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    final += event.results[i][0].transcript;
                } else {
                    interim += event.results[i][0].transcript;
                }
            }

            setInterimText(interim);

            if (final) {
                setInterimText(''); // リアルタイムテキストをクリア
                onRecognized(final); // 発話が終了したらテキストを渡す
            }
        };

        speechRecognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };

        setRecognition(speechRecognition);
    }, [onRecognized]);

    useEffect(() => {
        if (isMicOn && !isLoaded && !isSpeech && recognition) {
            recognition.start();
        } else if (recognition) {
            recognition.stop();
        }

        return () => {
            if (recognition) {
                recognition.stop();
            }
        };
    }, [isMicOn, isLoaded, isSpeech, recognition]);

    return { interimText };
};
