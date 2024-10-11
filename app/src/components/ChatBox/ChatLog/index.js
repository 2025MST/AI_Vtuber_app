import { Box } from '@mui/system';
import React, {useMemo, useRef, useEffect} from 'react';

export const ChatLog = ({chatData}) => {

    const chatLogRef = useRef(null);

    useEffect(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    },[chatData])

    const chatLog = useMemo(() => {
        return chatData.map((message, index) => (
            <Box
                sx={{
                    textAlign: message.from === 'user' ? 'right' : 'left',
                    backgroundColor: message.from === 'user' ? '#d1e7dd' : 'f1f1f1',
                    borderRadius: '10px',
                    padding: '3px',
                    margin: '5px',
                    maxWidth: '80%',
                    alignSelf: message.from === 'user' ? 'flex-end' : 'flex-start'
                }}
            >
                {message.text}
            </Box>))
    },[chatData])

    return (
        <Box
            ref={chatLogRef}
            sx={{
                height: '80%',
                width: '500px',
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                padding: '10px',
                backgroundColor: '#e1e1e1'
            }}
        >
            {chatLog}
        </Box>
    )
}