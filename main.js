const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron')
const ethers = require("ethers");
const Store = require('electron-store');
const path = require('path')
const url = require('url');

const store = new Store();

let wallet;
let provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

let ready2Close = false;
let window = null;
const gotTheLock = app.requestSingleInstanceLock()
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

  return mainWindow;

  // mainWindow.webContents.openDevTools()
}

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine) => {

    if (window) {
      if (window.isMinimized()) window.restore()
      window.focus()
    }
  })

  app.whenReady().then(() => {
    window = createWindow()

    ipcMain.on("CreateAccount", (e, password) => {
      const Wallet = ethers.Wallet.createRandom(provider);
      wallet = Wallet;
      Wallet.encrypt(password).then((data) => {
        store.set('wallet', data);
      })
      e.returnValue = Wallet.mnemonic?.phrase;
    })

    ipcMain.on("ImportAccount", (e, phrase, password) => {
      const Wallet = new ethers.Wallet(phrase, provider);
      wallet = Wallet;
      Wallet.encrypt(password).then((data) => {
        store.set('wallet', data);
      })
    })

    ipcMain.on("Unlock", async (e, password) => {
      try {
        const Wallet = await ethers.Wallet.fromEncryptedJson(store.get("wallet"), password);
        wallet = Wallet.connect(provider);
        e.returnValue = true;
      } catch {
        e.returnValue = false;
      }
    })

    ipcMain.on("GetBalance", async (e) => {
      e.returnValue = await wallet.getBalance();
    })

    ipcMain.on("SendTransaction", async (e) => {
      console.log(wallet.sendTransaction({ to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" }));
    })

    /* {to?: string, from?: string, nonce?: BigNumberish,
  
      gasLimit?: BigNumberish, gasPrice?: BigNumberish,
  
      data?: BytesLike, value?: BigNumberish, chainId?: number
  
      type?: number; accessList?: AccessListish;
  
      maxPriorityFeePerGas?: BigNumberish; maxFeePerGas?: BigNumberish;
  
      customData?: Record<string, any>; ccipReadEnabled?: boolean;} */

    ipcMain.on("StoreHas", (e, key) => {
      e.returnValue = store.has(key);
    })

    ipcMain.on("ClearData", () => {
      store.clear();
    })

    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
}

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
