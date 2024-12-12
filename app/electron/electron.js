const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config({ path : path.resolve(__dirname, '../../.env')});
require('electron-reload')(path.join(__dirname, '../build'),{
    electron: require(`${__dirname}/../../node_modules/electron`)
})

let mainWindow;
let voicevoxServer;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1500,
        height: 1200,
        minWidth: 1500,
        minHeight: 1030,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: true,
            webSecurity: false,
        },
        resizable : true,
        autoHideMenuBar: true,
        fullscreenable: true,
        maximizable: true,
    });

    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));

    mainWindow.on('closed', () => {
        mainWindow = null;
        if (voicevoxServer) {
            voicevoxServer.kill('SIGINT');
            setTimeout(() => {
                if (!voicevoxServer.killed) {
                    voicevoxServer.kill('SIGKILL');
                }
            },3000);
            console.log("VOICE VOX Server stoped");
        }
    });
}

app.commandLine.appendSwitch('enable-features', 'WebSpeechAPI');

app.whenReady().then(() => {
    createWindow();

    voicevoxServer = spawn(path.join(__dirname, '../resource/voicevox_engine-windows-cpu-0.21.1/windows-cpu','run.exe'));

    voicevoxServer.stdout.on('data', (data) => {
        console.log(`VOICEVOX : ${data}`);
    });

    voicevoxServer.stderr.on('data', (data) => {
        console.log(`VOICEVOX ERROR : ${data}`);
    });

    // F12キーでフルスクリーンのトグル
    globalShortcut.register('F12', () => {
        const isFullScreen = mainWindow.isFullScreen();
        mainWindow.setFullScreen(!isFullScreen);  // フルスクリーン状態の切り替え
    });

    // F11キーで開発者ツールのトグル
    globalShortcut.register('F11', () => {
        const isDevToolsOpened = mainWindow.webContents.isDevToolsOpened();
        if (isDevToolsOpened) {
            mainWindow.webContents.closeDevTools();
        } else {
            mainWindow.webContents.openDevTools();
        }
    });
});

ipcMain.handle('get-api-key', () => process.env.OPENAI_PUBLIC_KEY);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
