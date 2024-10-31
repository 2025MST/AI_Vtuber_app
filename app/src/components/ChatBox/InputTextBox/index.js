import React, { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { Send } from '@mui/icons-material';

export const InputTextBox = ({onSend}) => {

    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (inputText.trim()) {
            onSend(inputText);
            setInputText('');
        }
    }

    return(
        <Box sx={{
            position: 'absolute',
            bottom: '15px',
            left : '50%',
            transform: 'translateX(-50%)',
            width: '95%',
            maxWidth: '500px',
            backgroundColor: '#f7f7f7',
            borderRadius : 50,
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
            padding: '5px 10px',
        }}>
            <TextField 
                onChange={(event) => setInputText(event.target.value)}
                onKeyPress={(event) => {
                    if (event.key === 'Enter') handleSend();
                }}
                value={inputText} 
                sx={{ 
                    flexGrow: 1, 
                    margin: 1, 
                    backgroundColor: '#fff',
                    borderRadius: '20px',
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'transparent', // ボーダーを非表示
                        },
                        '&:hover fieldset': {
                            borderColor: 'transparent',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'transparent',
                        },
                    },
                    input: {
                        padding: '10px 15px',
                    }
                }} 
                placeholder='メッセージを入力'
            />
            <IconButton
                onClick={handleSend}
                sx={{
                    width: '50px',
                    height: '50px',
                    color: '#00b900', // LINEの送信ボタンの緑色
                    marginRight: '5px'
                }}
            >
                <Send fontSize="large" />
            </IconButton>
        </Box>
    )
}
