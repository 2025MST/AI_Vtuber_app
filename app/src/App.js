import React, { useEffect } from 'react';
import Live2DView from './components/Live2DView';

function App() {

	useEffect(() => {
		console.log("確認できていますか");
	},[]);

	return (
		<div>
		<h1>Electron + React + Flask</h1>
		<Live2DView />
		</div>
	);
}

export default App;
