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
            left : '0',
            width: '500px',
            backgroundColor: '#e6e6e6',
            borderRadius : 5,
            display: 'flex',
            verticalAlign: 'middle',
        }}>
                <TextField 
                    onChange={(event) => setInputText(event.target.value)}
                    onKeyPress={(event) => {
                        if (event.key === 'Enter') handleSend();
                    }}
                    value={inputText} 
                    sx={{ flexGrow: 1, margin: 2 }} 
                    placeholder='メッセージを送信'
                />
                <IconButton
                    onClick={handleSend}
                    sx={{
                        width: '60px',
                        height: '60px',
                    }}
                >
                    <Send fontSize="inherit" />
                </IconButton>
        </Box>
    )
}