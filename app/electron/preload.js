const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInIsolatedWorld('electonAPI', {
    sendMessage: (message) => ipcRenderer.send('message', message)
});