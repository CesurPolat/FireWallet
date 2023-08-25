const { app, BrowserWindow, Tray, Menu, ipcMain, dialog } = require('electron')
const Store = require('electron-store');
const path = require('path')
const url = require('url');
const jdenticon = require("jdenticon");
const WebSocket = require("ws");
const config = require("./config.js");
const store = new Store()

//TODO: Edit Package.json Scripts

global.share = { ipcMain }
global.store = { store }

reset()

let ready2Close = false;
let mWindow = null;
const gotTheLock = app.requestSingleInstanceLock();
const logo = path.join(__dirname, "logo.png");
const location = app.isPackaged ? url.format({ pathname: path.join(__dirname, 'dist/index.html'), protocol: 'file:', slashes: true }) : "http://localhost:5173/";

function createWindow(Local, isTray = true) {
  const mainWindow = new BrowserWindow({
    width: 357,
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

  return mainWindow
}

let params = process.argv.pop().split("firewallet://")[1];
//process.argv.filter(x => x.includes("=")).map(x => Object.assign(obj, { [x.split("=")[0].slice(2)]: x.split("=")[1] }));

if (!gotTheLock) {
  if (!params) {
    app.quit()
  } else {
    console.log("Notification");
    
  }
} else {
  app.on('second-instance', (event, commandLine, workingPath, additionalData) => {
    
    params = commandLine.pop().split("firewallet://")[1];
    
    //let objTemp = {};
    //commandLine.filter(x => x.includes("=")).map(x => Object.assign(objTemp, { [x.split("=")[0].slice(2)]: x.split("=")[1] }));
    
    if (params) {
      notificationWindow = createWindow(location + "#/notification?" + new URLSearchParams(params).toString(), false)
      focusWindow(notificationWindow)
    } else {
      focusWindow(mWindow)
    }

  })

  const wss = new WebSocket.Server({ port: 5418 });
    wss.on('connection', function connection(ws) {
      console.log(util.inspect(server.listeners('connection')));

      ws.on('error', console.error);

      ws.on('message', function message(data) {
        console.log('received: %s', data);
      });

      ws.send('something');
    });

  app.whenReady().then(() => {

    if (process.defaultApp) {
      if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient('firewallet', process.execPath, [path.resolve(process.argv[1])])
      }
    } else {
      app.setAsDefaultProtocolClient('firewallet')
    }

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

app.on('open-url', (event, url) => {
  dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`)
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
  config.reset()
}

require("./wallet");