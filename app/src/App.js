import React, { useState } from 'react';
import Live2DView from './components/Live2DView';
import { Box, Modal, Stack, } from '@mui/material';
import { Comment, CommentsDisabled, Mic, MicOff, Settings, Videocam, VideocamOff } from '@mui/icons-material';
import { TogleButton } from './components/TogleButton';
import { SettingModal } from './components/SettingModal';
import { ChatBox } from './components/ChatBox';
import useChatgpt from './hooks/useChatgpt';
import useVoiceVox from './hooks/useVoiceVox';
import useCameraRecognition from './hooks/useCameraRecognition';

function App() {

	const [settingOpen, setSettingOpen] = useState(false);
	const [toggleMute, setToggleMute] = useState(false);
	const [toggleCamera, setToggleCamera] = useState(false);
	const [toggleComment, setToggleComment] = useState(false);

	const chatgpt = useChatgpt();
	const voicevox = useVoiceVox();
	const cameraRecognition = useCameraRecognition();

	return (
		<div>
			<Stack direction="column" spacing={1} sx={{
				alignItems: 'center',
				alignContent: 'center',
				position: 'absolute',
				margin: '10px'
			}}>
				<TogleButton
					label={"setting"} 
					onClick={() => setSettingOpen(!settingOpen)}
					innerIcon={<Settings fontSize='inherit' />}
				/>
				<TogleButton
					label={"audioMute"}
					onClick={() => setToggleMute(!toggleMute)}
					style={{
						backgroundColor : toggleMute ? 'white' : 'black',
						color : toggleMute ? 'black' : 'white',
					}}
					innerIcon={toggleMute ? <Mic fontSize='inherit' /> : <MicOff fontSize='inherit' />}
				/>
				<TogleButton
					label={"camera"}
					onClick={() => setToggleCamera(!toggleCamera)}
					style={{
						backgroundColor : toggleCamera ? 'white' : 'black',
						color : toggleCamera ? 'black' : 'white',
					}}
					innerIcon={toggleCamera ? <Videocam fontSize='inherit' /> : <VideocamOff fontSize='inherit' />}
				/>
				<TogleButton
					label={"commentBox"}
					onClick={() => setToggleComment(!toggleComment)}
					style={{
						background : toggleComment ? 'white' : 'black',
						color : toggleComment ? 'black' : 'white',
					}}
					innerIcon={toggleComment ? <Comment fontSize="inherit" /> : <CommentsDisabled fontSize="inherit" />}
				/>
			</Stack>

			<Modal
				open={settingOpen}
				onClose={() => setSettingOpen(false)}
			>
				<SettingModal
					cameraRecognition={cameraRecognition}
				/>
			</Modal>

			{toggleComment && (
				<ChatBox chatgpt={chatgpt} voicevox={voicevox} />
			)}

			<Live2DView voicevox={voicevox} cameraRecognition={cameraRecognition} isCameraOn={toggleCamera} />

		</div>
	);
}

export default App;
