const { app, BrowserWindow, Tray, Menu  } = require('electron')
const path = require('path')
const url = require('url');

let ready2Close=false;

function createWindow () {
  
  const mainWindow = new BrowserWindow({
    width: 357,//800
    height: 600,
    icon:"logo.png",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  tray = Tray("logo.png")
  tray.setToolTip("FireWallet")
  tray.on('click',()=>{
    mainWindow.show();
  })
  var contextMenu=Menu.buildFromTemplate([
    {label:"Quit",type:'normal',click:()=>{ready2Close=true; app.quit()}}
  ])
  tray.setContextMenu(contextMenu)
  
  mainWindow.setMenuBarVisibility(false)
  mainWindow.on('close',(e)=>{if(!ready2Close){e.preventDefault();} mainWindow.hide()})

  if(app.isPackaged){
    mainWindow.loadURL(url.format({      
      pathname: path.join(
        __dirname,
        'dist/index.html'),       
      protocol: 'file:',      
      slashes: true     
    }))

  }else{
    mainWindow.loadURL("http://localhost:5173/")
  }

  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
