const { contextBridge, ipcRenderer } = require('electron')

window.addEventListener("mouseup", (e) => {
    if (e.button === 3 || e.button === 4)
        e.preventDefault();
});

contextBridge.exposeInMainWorld('API', {
    ResizeWindow: (width, height) => ipcRenderer.send('resize-window', width, height),
    CreateAccount: (password) => ipcRenderer.sendSync("CreateAccount", password),
    ImportAccount: (phrase, password) => ipcRenderer.sendSync("ImportAccount", phrase, password),
    Unlock: (password) => ipcRenderer.sendSync("Unlock", password),
    Lock: () => ipcRenderer.send("Lock"),
    GetBalance: () => ipcRenderer.sendSync("GetBalance"),
    SendTransaction: (obj) => ipcRenderer.send("SendTransaction", obj),
    StoreHas: (key) => ipcRenderer.sendSync("StoreHas", key),
    ClearData: () => ipcRenderer.send("ClearData"),
    GetNetworks: ()=>ipcRenderer.sendSync("getNetworks"),
    GetSelectedNetwork: ()=>ipcRenderer.sendSync("getSelectedNetwork"),
    SetNetworks:(networkId, networks)=>ipcRenderer.send("setNetworks",networkId, networks),
})