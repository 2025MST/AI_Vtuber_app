const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');

contextBridge.exposeInMainWorld('electronAPI', {
    getAudioDevices: () => navigator.mediaDevices.enumerateDevices(),
    deleteFile: (filePath) => {
        try {
            fs.unlinkSync(path.resolve(__dirname, filePath));
            return true;
        } catch (error) {
            console.error("ファイル削除失敗 : ", error);
            return false;
        } 
    },
});