const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let mainWindow;
let pythonServer;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: false,
            nodeIntegration: true
        },
        autoHideMenuBar: true
    });

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
    pythonServer = spawn(pythonCmd, ['app/python/app.py'], {
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
