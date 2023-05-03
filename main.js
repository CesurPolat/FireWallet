const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron')
const ethers = require("ethers");
const Store = require('electron-store');
const path = require('path')
const url = require('url');

const store = new Store();

let wallet;
let provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

let ready2Close = false;

const logo = path.join(__dirname, "logo.png");

function createWindow() {

  const mainWindow = new BrowserWindow({
    width: 357,//800
    height: 600,
    icon: logo,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  tray = Tray(logo)
  tray.setToolTip("FireWallet")
  tray.on('click', () => {
    mainWindow.show();
  })
  var contextMenu = Menu.buildFromTemplate([
    { label: "Quit", type: 'normal', click: () => { ready2Close = true; app.quit() } }
  ])
  tray.setContextMenu(contextMenu)

  mainWindow.setMenuBarVisibility(false)
  mainWindow.on('close', (e) => { if (!ready2Close) { e.preventDefault(); } mainWindow.hide() })

  ipcMain.on("resize-window", (e, width, height) => {
    mainWindow.setSize(width, height, true);
  })

  if (app.isPackaged) {
    mainWindow.loadURL(url.format({
      pathname: path.join(
        __dirname,
        'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }))

  } else {
    mainWindow.loadURL("http://localhost:5173/")
  }

  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()



  ipcMain.on("CreateAccount", (e, password) => {
    const Wallet = ethers.Wallet.createRandom(provider);
    wallet = Wallet;
    Wallet.encrypt(password).then((data) => {
      store.set('wallet', data);
    })
    e.returnValue = Wallet.mnemonic?.phrase;
  })

  ipcMain.on("Unlock", async (e, password) => {
    try {
      const Wallet = await ethers.Wallet.fromEncryptedJson(store.get("wallet"), password);
      this.wallet = Wallet.connect(provider);
      e.returnValue=true;
    } catch {
      e.returnValue=false;
    }
  })

  ipcMain.on("StoreHas",(e,key)=>{
    e.returnValue=store.has(key);
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
