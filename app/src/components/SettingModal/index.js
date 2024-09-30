import React from "react";
import { Box, FormControl, InputLabel, Typography, Select, MenuItem, TextField } from "@mui/material";
import { Mic } from "@mui/icons-material";

export const SettingModal = ({ audioDeviceList, twitchUrl, selectedAudioDevice, setSelectedAudioDevice,setTwitchUrl }) => {
    return(
        <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            width: '60%',
            height: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
        }}>
            <h2>設定</h2>
            <FormControl sx={{ m: 1, minWidth: 150, maxWidth: 500}}>
                <InputLabel id="selected-AudioDevice" sx={{display: 'flex'}}>
                    <Mic />
                    <Typography>オーディオデバイス</Typography>
                </InputLabel>
                <Select labelId='selected-AudioDevice' value={selectedAudioDevice} onChange={setSelectedAudioDevice} sx={{ width: 500 }}>
                    {audioDeviceList.map((device) => (
                        <MenuItem value={device.deviceId}>{device.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 150, maxWidth: 500 }}>
                <TextField labelId='twitchUrl' value={twitchUrl} onChange={setTwitchUrl} sx={{ width: 500 }} placeholder='Twitch URL'/>
            </FormControl>
        </Box>
    )
}