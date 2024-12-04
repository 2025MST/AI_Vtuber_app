import React, {useState} from 'react';
import axios from 'axios';

const VOICE_VOX_HOST = "127.0.0.1";
const VOICE_VOX_PORT = 50021;

const useVoiceVox = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSpeech, setIsSpeech] = useState(false);
    const [audioData, setAudioData] = useState(null);

    const audioQuery = async (text, speaker=1) => {
        try {
            const response = await axios.post(
                `http://${VOICE_VOX_HOST}:${VOICE_VOX_PORT}/audio_query`,
                null,
                { params: {text, speaker}, timeout: 30000}
            );
            return response.data;
        } catch (err) {
            console.error("Audio Query Error : ", err);
        }
    }

    const synthesis = async (queryData, speaker=1) => {
        try{
            const response = await axios.post(
                `http://${VOICE_VOX_HOST}:${VOICE_VOX_PORT}/synthesis`,
                queryData,
                {
                    params: {speaker},
                    headers: { "Content-Type": "application/json"},
                    responseType: "arraybuffer",
                    timeout: 30000,
                }
            );
            return response.data;
        } catch (err) {
            console.error("Synthesis Error : ", err);
        }
    }

    const generateVoice = async (text, speaker=1) => {
        setIsLoading(true);
        setAudioData(null);

        try {
            const queryData = await audioQuery(text, speaker);
            const audio = await synthesis(queryData,speaker);
            setAudioData(audio);
            setSpeech(true);
        } catch (err) {
            console.error("Generate Speech Audio Error : ", err);
        } finally {
            setIsLoading(false);
        }
    }

    const setSpeech = (isSpeech) => {
        setIsSpeech(isSpeech);
    }

    return {
        audioData,
        isLoading,
        isSpeech,
        generateVoice,
        setSpeech,
    }
}

export default useVoiceVox;