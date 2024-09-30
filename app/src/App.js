import React, { useCallback, useEffect, useState } from 'react';
import Live2DView from './components/Live2DView';
import { Box, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material';
import { Comment, CommentsDisabled, Mic, MicOff, Send, Settings, TextFields } from '@mui/icons-material';
import { TogleButton } from './components/TogleButton';
import { SettingModal } from './components/SettingModal';
import { SendTextBox } from './components/SendTextBox';

function App() {

	const [settingOpen, setSettingOpen] = useState(false);
	const [togleMute, setTogleMute] = useState(false);
	const [togleText, setTogleText] = useState(false);
	const [togleComment, setTogleComment] = useState(false);
	const [audioDeviceList, setAudioDeviceList] = useState([]);
	const [selectedAudioDevice, setSelectedAudioDevice] = useState(null);
	const [sendText, setSendText] = useState("");
	const [twitchUrl, setTwitchUrl] = useState("");

	useEffect(() => {
		const getAudioDevice = async () => {
			navigator.mediaDevices.enumerateDevices().then(deviceInfo => {
				console.log("デバイス確認テスト",deviceInfo)
				const audioDevices = deviceInfo.filter(device => device.kind === 'audioinput');
				console.log("音声デバイス確認テスト",audioDevices);
				setAudioDeviceList(audioDevices);
			});
		}

		getAudioDevice();
	},[]);

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
					onClick={() => setTogleMute(!togleMute)}
					style={{
						backgroundColor : togleMute ? 'white' : 'black',
						color : togleMute ? 'black' : 'white',
					}}
					innerIcon={togleMute ? <Mic fontSize='inherit' /> : <MicOff fontSize='inherit' />}
				/>
				<TogleButton
					label={"textBox"}
					onClick={() => setTogleText(!togleText)}
					style={{
						backgroundColor : togleText ? 'white' : 'black',
						color : togleText ? 'black' : 'white'
					}}
					innerIcon={<TextFields fontSize="inherit" />}
				/>
				<TogleButton
					label={"commentBox"}
					onClick={() => setTogleComment(!togleComment)}
					style={{
						background : togleComment ? 'white' : 'black',
						color : togleComment ? 'black' : 'white',
					}}
					innerIcon={togleComment ? <Comment fontSize="inherit" /> : <CommentsDisabled fontSize="inherit" />}
				/>
			</Stack>

			<Modal
				open={settingOpen}
				onClose={() => setSettingOpen(false)}
			>
				<SettingModal
					audioDeviceList={audioDeviceList}
					twitchUrl={twitchUrl}
					selectedAudioDevice={selectedAudioDevice}
					setSelectedAudioDevice={(event) => setSelectedAudioDevice(event.target.value)}
					setTwitchUrl={(event) => setTwitchUrl(event.target.value)}
				/>
			</Modal>

			{togleText && (
				<SendTextBox
					sendText={sendText}
					setSendText={(event) => setSendText(event.target.value)}
				/>
			)}

			<Live2DView />
		</div>
	);
}

export default App;
