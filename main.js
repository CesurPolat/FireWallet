const { app, BrowserWindow, Tray, Menu, ipcMain, safeStorage  } = require('electron')
const ethers = require("ethers");
const path = require('path')
const url = require('url');

let wallet;
let provider=new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

let ready2Close=false;

const logo=path.join(__dirname,"logo.png");

function createWindow () {
  
  const mainWindow = new BrowserWindow({
    width: 357,//800
    height: 600,
    icon:logo,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  tray = Tray(logo)
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

  ipcMain.on("resize-window",(e,width,height)=>{
    mainWindow.setSize(width,height,true);
  })

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



  ipcMain.on("CreateAccount",(e,password)=>{
    const wallet = Wallet.createRandom(provider);
    //console.log('mnemonic:', wallet.mnemonic?.phrase)
    wallet.encrypt(password).then((data) => {
      localStorage['wallet'] = data;
    })
  })

  //console.log(BrowserWindow.getAllWindows().length);
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
