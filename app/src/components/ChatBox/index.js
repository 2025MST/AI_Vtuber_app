// ChatBox.jsx
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { InputTextBox } from './InputTextBox';
import { ChatLog } from './ChatLog';

export const ChatBox = ({ chatgpt, voicevox }) => {
    const [chatData, setChatData] = useState(() => {
        // localStorageから既存のチャットデータを取得
        const savedChatData = localStorage.getItem('chatData');
        return savedChatData ? JSON.parse(savedChatData) : [];
    });

    useEffect(() => {
        // チャットデータが変更されたときにlocalStorageに保存
        localStorage.setItem('chatData', JSON.stringify(chatData));
    }, [chatData]);

    const handleSendInputText = async (inputData) => {
        if (inputData.trim()) {
            setChatData((prev) => {
                const newChatData = [...prev, { from: 'user', text: inputData }];
                localStorage.setItem('chatData', JSON.stringify(newChatData)); // 更新後に保存
                return newChatData;
            });

            const aiResponse = await chatgpt.getChatgptResponse(inputData);

            setChatData((prev) => {
                const newChatData = [...prev, { from: 'ai', text: aiResponse}];
                localStorage.setItem('chatData', JSON.stringify(newChatData));
                return newChatData;
            });

            voicevox.generateVoice(aiResponse);
        }
    };

    return (
        <Box
            sx={{
                height: '95%',
                width: '600px',
                backgroundColor: '#f9f9f9',
                position: 'absolute',
                right: '0',
            }}
        >
            <ChatLog chatData={chatData} />
            <InputTextBox onSend={handleSendInputText} />
        </Box>
    );
};
