const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('API', {
    ResizeWindow: (width,height) => ipcRenderer.send('resize-window',width,height),
    CreateAccount: (password)=>  ipcRenderer.sendSync("CreateAccount",password),
    Unlock: (password)=>  ipcRenderer.sendSync("Unlock",password),
    StoreHas: (key)=> ipcRenderer.sendSync("StoreHas",key),
})