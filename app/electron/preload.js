const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');

contextBridge.exposeInMainWorld('Electron', {
    getAudioDevices: () => navigator.mediaDevices.enumerateDevices(),
    getApiKey: () => ipcRenderer.invoke('get-api-key'),
});