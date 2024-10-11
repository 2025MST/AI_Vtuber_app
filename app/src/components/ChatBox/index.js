import { Height } from '@mui/icons-material';
import { Box } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { InputTextBox } from './InputTextBox';
import { ChatLog } from './ChatLog';

export const ChatBox = ({socket}) => {

    const [chatData, setChatData] = useState([]);

    useEffect(() => {
        socket.on('server_responce_text',(textData) => {
            console.log('ai_res : ', textData);
            setChatData(prev => [...prev,{from: 'ai', text: textData}]);
        });
    },[])

    useEffect(() => {console.log(chatData)},[chatData])

    const handleSendInputText = async(inputData) => {
        if (inputData.trim()) {
            setChatData(prev => [...prev,{from: 'user', text: inputData}]);
            socket.emit('user_text_data', inputData);
        }
    }

    return(
        <Box sx={{
            height: '95%',
            width: '600px',
            backgroundColor: '#f9f9f9',
            position: 'absolute',
            right: '0',
        }}>
            <ChatLog chatData={chatData}/>
            <InputTextBox onSend={handleSendInputText} />
        </Box>
    )
}