const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('API', {
    ResizeWindow: (width, height) => ipcRenderer.send('resize-window', width, height),
    CreateAccount: (password) => ipcRenderer.sendSync("CreateAccount", password),
    ImportAccount: (phrase, password) => ipcRenderer.sendSync("ImportAccount",phrase, password),
    Unlock: (password) => ipcRenderer.sendSync("Unlock", password),
    GetBalance: () => ipcRenderer.sendSync("GetBalance"),
    SendTransaction: (obj) => ipcRenderer.send("SendTransaction", obj),
    StoreHas: (key) => ipcRenderer.sendSync("StoreHas", key),
    ClearData: () => ipcRenderer.send("ClearData"),
})