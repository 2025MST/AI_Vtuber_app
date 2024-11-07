import React from "react";
import { Box, TextField, IconButton } from "@mui/material";
import { Send } from "@mui/icons-material";

export const SendTextBox = ({ sendText, setSendText }) => {
    return(
        <Box sx={{
            bottom: '3%',
            left : '50%',
            transform: 'translate(-50%,-50%)',
            width: 800,
            backgroundColor: '#f8f8f8',
            borderRadius : 5,
            display: 'flex',
            justifyContent: 'center'
        }}>
                <TextField value={sendText} onChange={setSendText}  sx={{ flexGrow: 1, margin: 2 }} />
                <IconButton>
                    <Send fontSize="inherit" />
                </IconButton>
        </Box>
    )
}