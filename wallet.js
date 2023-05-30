const ethers = require("ethers");
const axios = require('axios');

let wallet;
let provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const ipcMain=global.share.ipcMain;
const store=global.store.store;

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

ipcMain.on("SendTransaction", async (e, obj) => {
    port=obj.port
    delete obj.port
    axios.post("http://127.0.0.1:"+port,{message:(wallet.sendTransaction(obj))});
    
})

/* {to?: string, from?: string, nonce?: BigNumberish,
  
      gasLimit?: BigNumberish, gasPrice?: BigNumberish,
  
      data?: BytesLike, value?: BigNumberish, chainId?: number
  
      type?: number; accessList?: AccessListish;
  
      maxPriorityFeePerGas?: BigNumberish; maxFeePerGas?: BigNumberish;
  
      customData?: Record<string, any>; ccipReadEnabled?: boolean;} */