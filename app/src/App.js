import React, { useCallback, useEffect, useState } from 'react';
import Live2DView from './components/Live2DView';
import { Box, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material';
import { Comment, CommentsDisabled, Mic, MicOff, Send, Settings, TextFields } from '@mui/icons-material';
import { TogleButton } from './components/TogleButton';

function App() {

	const [settingOpen, setSettingOpen] = useState(false);
	const [togleMute, setTogleMute] = useState(false);
	const [togleText, setTogleText] = useState(false);
	const [togleComment, setTogleComment] = useState(false);
	const [audioDeviceList, setAudioDeviceList] = useState([]);
	const [selectedAudioDevice, setSelectedAudioDevice] = useState(null);
	const [sendText, setSendText] = useState("");
	const [twitchUrl, setTwitchUrl] = useState("");

	const refreshDevices = useCallback(async () => {
		const latestDevices = (
			await navigator.mediaDevices.enumerateDevices()
		).filter((device) => device.kind === "audioinput");

		setAudioDeviceList(latestDevices);
	},[])

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

	const handleCloseSetting = () => {
		setSettingOpen(false);
	}

	const handleChangeAudioDevice = (event) => {
		setSelectedAudioDevice(event.target.value);
	}

	const handleChangeSendText = (event) => {
		setSendText(event.target.value);
	}

	const handleChangeTwitchUrl = (event) => {
		setTwitchUrl(event.target.value);
	}

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
				onClose={handleCloseSetting}
			>
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
						<Select labelId='selected-AudioDevice' value={selectedAudioDevice} onChange={handleChangeAudioDevice} sx={{ width: 500 }}>
							{audioDeviceList.map((device) => (
								<MenuItem value={device.deviceId}>{device.label}</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl sx={{ m: 1, minWidth: 150, maxWidth: 500 }}>
						<TextField labelId='twitchUrl' onChange={handleChangeTwitchUrl} value={twitchUrl} sx={{ width: 500 }} placeholder='Twitch URL'/>
					</FormControl>
				</Box>
			</Modal>

			{togleText && (
				<Box sx={{
					position: 'fixed',
					bottom: '3%',
					left : '50%',
					transform: 'translate(-50%,-50%)',
					width: 800,
					backgroundColor: '#f8f8f8',
					borderRadius : 5,
					display: 'flex',
					justifyContent: 'center'
				}}>
						<TextField onChange={handleChangeSendText} value={sendText} sx={{ flexGrow: 1, margin: 2 }} />
						<IconButton>
							<Send fontSize="inherit" />
						</IconButton>
				</Box>
			)}

			<Live2DView />
		</div>
	);
}

export default App;
