import axios from 'axios';
import React, { useCallback, useState, useEffect } from 'react';

const useChatgpt = () => {
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getChatgptResponse = useCallback(async (userMessage) => {

        const chatgptPayload = {
            model : "gpt-3.5-turbo",
            messages : [
                {
                  role: "system",
                  content: `
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
                  `,
                },
                { role: "user", content: userMessage },
            ],
        }

        try {
            setIsLoading(true);
            const apiResponse = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                chatgptPayload,
                {
                    headers: {
                        "Content-Type" : "application/json",
                        Authorization : `Bearer ${await window.Electron.getApiKey()}`
                    },
                }
            )

            const replyText = apiResponse.data.choices[0].message.content.trim();
            setResponse(replyText);
            return replyText;

        } catch (err) {
            console.error(err.message || "エラーが発生しました");
        } finally {
            setIsLoading(false);
        }
    },[]);

    return {response, isLoading, getChatgptResponse};
}

export default useChatgpt;