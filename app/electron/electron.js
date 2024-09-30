const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let mainWindow;
let pythonServer;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 1200,
        minWidth: 1030,
        minHeight: 1030,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: true,
            webSecurity: false,
        },
        resizable : true,
        autoHideMenuBar: true
    });

    // mainWindow.webContents.openDevTools(); // 開発用

    mainWindow.maximize();

    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));

    mainWindow.on('closed', () => {
        mainWindow = null;
        if (pythonServer) {
            pythonServer.kill('SIGINT');
            setTimeout(() => {
            if (!pythonServer.killed) {
                pythonServer.kill('SIGKILL');
            }
            },3000);
            console.log("Python Server stoped");
        }
    });
}

app.whenReady().then(() => {
    // Python Flaskサーバーを起動
    const pythonCmd = process.platform == 'win32' ? 'python' : 'python3';
    pythonServer = spawn(pythonCmd, [path.join(__dirname, '../python/app.py')], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, PYTHONBUFFERED: '1' }
    });
    pythonServer.stdout.on('data', (data) => {
        console.log(`Flask: ${data}`);
    });

    pythonServer.stderr.on('data', (data) => {
        console.error(`Flask Error: ${data}`);
    });

    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
