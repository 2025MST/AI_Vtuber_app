// ChatLog.jsx
import { Box } from '@mui/material';
import React, { useMemo, useRef, useEffect } from 'react';

export const ChatLog = ({ chatData }) => {
    const chatLogRef = useRef(null);

    useEffect(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    }, [chatData]);

    const chatLog = useMemo(() => {
        return chatData.map((message, index) => {
            const backgroundColor = message.from === 'user' ? '#4CAF50' : '#616161';
            const hoverBackgroundColor = message.from === 'user' ? '#45A049' : '#757575';
            
            return (
                <Box
                    key={index}
                    sx={{
                        display: 'flex',
                        flexDirection: message.from === 'user' ? 'row-reverse' : 'row',
                        alignItems: 'center',
                        margin: '5px 0',
                    }}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            backgroundColor: backgroundColor,
                            color: '#FFFFFF',
                            borderRadius: '10px', // 吹き出しの角を丸く
                            padding: '15px 25px',
                            margin: '5px 20px',
                            maxWidth: '50%',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                            wordWrap: 'break-word',//テキスト折り返しの設定
                            maxwidth: '80%',
                            width: 'fit-content', // テキストの長さに応じて幅を調整
                            lineHeight: '1.3',
                            fontSize: '20px', // 文字の大きさを大きくする
                            letterSpacing: '0.5px', // 文字間を少し広げる
                            transition: 'background-color 0.3s',
                            '&:hover': {
                                backgroundColor: hoverBackgroundColor,
                                '&::after': {
                                    borderTopColor: hoverBackgroundColor, // 三角形部分の色かえ
                                },
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                width: '0',
                                height: '0',
                                border: '10px solid transparent',
                                borderTopColor: backgroundColor, // 吹き出しの背景色
                                top: '10px',
                                left: message.from === 'user' ? 'auto' : '-10px',
                                right: message.from === 'user' ? '-10px' : 'auto',
                            },
                        }}
                    >
                        {message.text}
                    </Box>
                </Box>
            );
        });
    }, [chatData]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px',
            }}
        >
            <Box
                ref={chatLogRef}
                sx={{
                    height: '600px',
                    width: '100%',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '10px',
                    backgroundColor: '#B3E5FC', // 水色を少し濃くする
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
                    marginBottom: '10px',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                }}
            >
                {chatLog}
            </Box>
        </Box>
    );
};
