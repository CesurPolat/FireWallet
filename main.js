const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron')
const Store = require('electron-store');
const path = require('path')
const url = require('url');
const express = require('express')
const jdenticon = require("jdenticon");

const server = express()
server.use(express.json())
const store = new Store()

reset()

global.share = { ipcMain }
global.store = { store }

let ready2Close = false;
let mWindow = null;
const gotTheLock = app.requestSingleInstanceLock();
const logo = path.join(__dirname, "logo.png");
const location = app.isPackaged ? url.format({ pathname: path.join(__dirname, 'dist/index.html'), protocol: 'file:', slashes: true }) : "http://localhost:5173/";

function createWindow(Local, isTray = true) {

  const mainWindow = new BrowserWindow({
    width: 357,//800
    height: 600,
    icon: logo,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (isTray) {
    tray = Tray(logo)
    tray.setToolTip("FireWallet")
    tray.on('click', () => {
      mainWindow.show();
    })
    var contextMenu = Menu.buildFromTemplate([
      { label: "Quit", type: 'normal', click: () => { ready2Close = true; app.quit() } }
    ])
    tray.setContextMenu(contextMenu)

    mainWindow.on('close', (e) => { if (!ready2Close) { e.preventDefault(); } mainWindow.hide() })
  }

  mainWindow.setMenuBarVisibility(false)

  ipcMain.on("resize-window", (e, width, height) => {
    mainWindow.setSize(width, height, true);
  })

  mainWindow.loadURL(Local)


  return mainWindow;

  // mainWindow.webContents.openDevTools()
}

let obj = {};//{to:10}
process.argv.filter(x => x.includes("=")).map(x => Object.assign(obj, { [x.split("=")[0].slice(2)]: x.split("=")[1] }));

if (!gotTheLock) {
  if (!Object.keys(obj).length) {
    app.quit()
  } else {
    server.post('/', function (req, res) {
      console.log(req.body);
      serverPort.close();
      app.quit()

    })

    const serverPort = server.listen(0);
    app.requestSingleInstanceLock(serverPort.address().port)
  }
} else {
  app.on('second-instance', (event, commandLine, workingPath, additionalData) => {

    let objTemp = {};
    commandLine.filter(x => x.includes("=")).map(x => Object.assign(objTemp, { [x.split("=")[0].slice(2)]: x.split("=")[1] }));

    if (Object.keys(objTemp).length && additionalData != null) {
      objTemp.port = additionalData;
      notificationWindow = createWindow(location + "#/notification?" + new URLSearchParams(objTemp).toString(), false)
      focusWindow(notificationWindow)
    } else {
      focusWindow(mWindow)
    }

  })

  app.whenReady().then(() => {
    mWindow = createWindow(location)

    ipcMain.on("jdenticon", async (e, value) => {
      e.returnValue = jdenticon.toSvg(value, 50);
    })

    ipcMain.on("StoreHas", (e, key) => {
      e.returnValue = store.has(key);
    })

    ipcMain.on("ClearData", () => {
      store.clear();
      reset()
    })


    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

  })
}

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.setLoginItemSettings({
  openAtLogin: true
})

function focusWindow(window) {
  if (window) {
    if (window.isMinimized()) window.restore()
    window.focus()
  }
}

function reset() {
  // []
  if (!store.has("networks")) {
    store.set("networks", ["http://127.0.0.1:8545"])
    store.set("selectedNetwork", 0)
  }

  if (!store.has("currency")) {
    store.set("currency", "USD")
  }
}

require("./wallet");