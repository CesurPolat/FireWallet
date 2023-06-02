const ethers = require("ethers");
const axios = require('axios');

const ipcMain=global.share.ipcMain;
const store=global.store.store;

let networks=[...store.get("networks")];
let selectedNetwork = store.get("selectedNetwork");

let wallet;
let provider = new ethers.providers.JsonRpcProvider(networks[selectedNetwork]);


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

ipcMain.on("Lock",(e) => {
    wallet=null
})

ipcMain.on("GetAddress", async (e)=>{
    e.returnValue = wallet.address
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


ipcMain.on("getNetworks",async (e)=>{
    e.returnValue = networks
})

ipcMain.on("getSelectedNetwork",async (e)=>{
    e.returnValue = selectedNetwork
})

// !!!
ipcMain.on("setNetworks", (e,networkId, Networks)=>{
    if(networkId!=undefined){
        selectedNetwork=networkId
        store.set("selectedNetwork",networkId)
    }

    if(Networks!=undefined){
        networks=Networks
        store.set("networks",Networks)
    }

    provider = new ethers.providers.JsonRpcProvider(networks[networkId]);

})

ipcMain.on("eth2Currency",async (e)=>{
    axios.get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms="+store.get("currency")).then((resp)=>{
        e.returnValue = resp.data[store.get("currency")];
    })
})