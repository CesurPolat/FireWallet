const ethers = require("ethers");
const axios = require('axios');
const WebSocket = require("ws");

const ipcMain = global.share.ipcMain;
const store = global.store.store;

let ws;

let wallet = [];
let provider;

ipcMain.on("SetProvider", (e, network) => {
    provider = new ethers.providers.JsonRpcProvider(network)
})

ipcMain.on("CreateAccount", (e, password) => {
    const Wallet = ethers.Wallet.createRandom(provider);
    wallet.push(Wallet);
    Wallet.encrypt(password).then((data) => {
        store.set('wallet', [...store.get("wallet"), data]);

        //TODO: Test
        store.set("accountCreated", [...store.get("accountCreated"), 1])
    })
    e.returnValue = Wallet.mnemonic?.phrase;
})

ipcMain.on("ImportAccount", (e, phrase, password) => {
    //TODO: Loading Router Has Feature
    const Wallet = new ethers.Wallet(phrase, provider);
    wallet.push(Wallet);
    Wallet.encrypt(password).then((data) => {
        store.set('wallet', [...store.get("wallet"), data]);
        store.set("accountCreated", [...store.get("accountCreated"), 1])

    })
})

ipcMain.on("Unlock", async (e, password) => {

    try {
        for (let x = 0; x < store.get("wallet").length; x++) {
            const Wallet = await ethers.Wallet.fromEncryptedJsonSync(store.get("wallet")[x], password);
            wallet.push(Wallet.connect(provider));
            for (let i = 1; i < store.get("accountCreated")[x]; i++) {
                const tempWallet = ethers.Wallet.fromMnemonic(Wallet.mnemonic.phrase, "m/44'/60'/" + i + "'/0/0")
                wallet.push(tempWallet.connect(provider));
            }

        }


        e.returnValue = true;
    } catch (err) {
        console.log(err);
        e.returnValue = false;
    }
})

ipcMain.on("Lock", (e) => {
    wallet = []
})

ipcMain.on("incAccount", (e) => {
    const tempWallet = ethers.Wallet.fromMnemonic(wallet[0].mnemonic.phrase, "m/44'/60'/" + (store.get("accountCreated")-1) + "'/0/0")
    wallet.push(tempWallet.connect(provider));
    var temp=store.get("accountCreated");
    temp[0]++;
    store.set("accountCreated", temp)
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
        e.returnValue={code:204}
    }).catch((err)=>{
        e.returnValue=(JSON.parse(err?.body)).error.message
    })
    

})


/* {to?: string, from?: string, nonce?: BigNumberish,

      gasLimit?: BigNumberish, gasPrice?: BigNumberish,

      data?: BytesLike, value?: BigNumberish, chainId?: number

      type?: number; accessList?: AccessListish;

      maxPriorityFeePerGas?: BigNumberish; maxFeePerGas?: BigNumberish;

      customData?: Record<string, any>; ccipReadEnabled?: boolean;} */

//https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms="+store.get("currency")

ipcMain.on("eth2Currency", async (e,currency="USD") => {
    axios.get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=" + currency).then((resp) => {
        e.returnValue = resp.data[currency];
    })
})