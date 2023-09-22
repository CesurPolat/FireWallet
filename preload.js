const { contextBridge, ipcRenderer } = require('electron');

//Prevent Back & Next Page Buttons From Mouse
window.addEventListener("mouseup", (e) => {
    if (e.button === 3 || e.button === 4)
        e.preventDefault();
});

contextBridge.exposeInMainWorld('API', {
    ResizeWindow: (width, height) => ipcRenderer.send('resize-window', width, height),
    SetProvider:(network)=>ipcRenderer.send("SetProvider",network),
    CreateAccount: (password) => ipcRenderer.sendSync("CreateAccount", password),
    ImportAccount: (phrase, password) => ipcRenderer.sendSync("ImportAccount", phrase, password),
    Unlock: async (password) => ipcRenderer.sendSync("Unlock", password),
    Lock: () => ipcRenderer.send("Lock"),
    incAccount:()=>ipcRenderer.send("incAccount"),
    GetAccounts:()=>ipcRenderer.sendSync("GetAccounts"),
    WsSend:(msg)=>ipcRenderer.send("WsSend",msg),
    SendTransaction: (obj) => ipcRenderer.sendSync("SendTransaction", obj),
    SignMessage: (obj) => ipcRenderer.sendSync("SignMessage", obj),
    StoreHas: (key) => ipcRenderer.sendSync("StoreHas", key),
    ClearData: () => {ipcRenderer.send("ClearData");localStorage.clear()},
    jdenticon:(value)=>ipcRenderer.sendSync("jdenticon", value),
    Eth2Currency:(currency)=>ipcRenderer.sendSync("eth2Currency",currency),

})