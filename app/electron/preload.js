const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getAudioDevices: () => navigator.mediaDevices.enumerateDevices(),
});