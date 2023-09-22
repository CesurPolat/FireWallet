const ethers = require("ethers");
const axios = require('axios');

const ipcMain = global.share.ipcMain;
const store = global.store.store;

let wallet = [];
let provider;

ipcMain.on("SetProvider", (e, network) => {
    provider = new ethers.providers.JsonRpcProvider(network)
})

ipcMain.on("CreateAccount", (e, password) => {
    const Wallet = ethers.Wallet.createRandom(provider);
    Wallet.encrypt(password).then((data) => {
        store.set('wallet', [...store.get("wallet"), {AccountName:"Account",childAccounts:1,wallet:data}]);
    })
    e.returnValue = Wallet.mnemonic?.phrase;
})

//TODO: ^
ipcMain.on("incAccount", (e) => {
    var temp=store.get("wallet");
    const tempWallet = ethers.Wallet.fromMnemonic(wallet[0].mnemonic.phrase, "m/44'/60'/" + (temp[0].childAccounts) + "'/0/0")
    wallet.push(tempWallet.connect(provider));
    temp[0].childAccounts++;
    store.set("wallet", temp)
})

ipcMain.on("ImportAccount", (e, phrase, password) => {
    //TODO: Loading
    const Wallet = new ethers.Wallet(phrase, provider);
    wallet.push(Wallet);
    Wallet.encrypt(password).then((data) => {
        store.set('wallet', [...store.get("wallet"), {AccountName:"Imported Account",childAccounts:0,wallet:data}]);

    })
})

ipcMain.on("Unlock", async (e, password) => {
    wallet=[];

    try {
        for (let x = 0; x < store.get("wallet").length; x++) {
            const Wallet = await ethers.Wallet.fromEncryptedJsonSync(store.get("wallet")[x].wallet, password);
            wallet.push(Wallet.connect(provider));
            for (let i = 1; i < store.get("wallet")[x].childAccounts; i++) {
                const tempWallet = ethers.Wallet.fromMnemonic(Wallet.mnemonic.phrase, "m/44'/60'/" + i + "'/0/0")
                wallet.push(tempWallet.connect(provider));
            }

        }


        e.returnValue = true;
    } catch (err) {
        e.returnValue = false;
    }
})

ipcMain.on("Lock", (e) => {
    wallet = []
})

ipcMain.on("GetAccounts", async (e) => {
    e.returnValue = wallet.map(x => x.address)
})

exports.getAccounts=async (e)=>{
    return wallet.map(x => x.address);
}

ipcMain.on("SendTransaction", async (e, obj) => {
    //TODO: ?
    delete obj.method
    delete obj.lastBaseFeePerGas
    obj.gasPrice=ethers.BigNumber.from(obj.gasPrice)
    delete obj.gasPrice
    obj.value =obj.value+''
    /* TODO: Fix !important */
    obj.gasLimit = ethers.BigNumber.from(60000)
    /* obj.maxFeePerGas=ethers.BigNumber.from(obj.maxFeePerGas)
    obj.maxPriorityFeePerGas=ethers.BigNumber.from(obj.maxPriorityFeePerGas) */
    console.log(obj);
    (wallet.find(x=>x.address==obj.from)).sendTransaction(obj).then((resp)=>{
        e.returnValue={result:resp+''}
    }).catch((err)=>{
        e.returnValue=(JSON.parse(err?.body)).error.message
    })
    

})

ipcMain.on("SignMessage", async (e, obj) => {
    
    (wallet.find(x=>x.address==obj.from)).signMessage(obj.message).then((resp)=>{
        e.returnValue={result:resp+''}
    }).catch((err)=>{
        console.log("Here");
        e.returnValue=(JSON.parse(err?.body)).error.message
    })
    

})

ipcMain.on("eth2Currency", async (e,currency="USD") => {
    axios.get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=" + currency).then((resp) => {
        e.returnValue = resp.data[currency];
    })
})