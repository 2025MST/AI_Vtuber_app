import React from "react";
import { Box, FormControl, InputLabel, Typography, Select, MenuItem, TextField } from "@mui/material";
import { Mic } from "@mui/icons-material";

export const SettingModal = React.forwardRef(({ cameraRecognition }) => {
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
				<video
					ref={cameraRecognition.videoEl}
					autoPlay
					muted
				/>
				<canvas
					ref={cameraRecognition.canvasEl}
				/>
				{cameraRecognition ? (
				  <p>
					最も近い顔の位置: X: {Math.round(cameraRecognition.faceX)}, Y: {Math.round(cameraRecognition.faceY)}
				  </p>
				) : (
				  <p>顔が検出されませんでした。</p>
				)}
            </FormControl>
        </Box>
    )
});