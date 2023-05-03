const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('API', {
    ResizeWindow: (width,height) => ipcRenderer.send('resize-window',width,height),
})