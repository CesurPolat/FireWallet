//import './assets/main.css'
import './assets/style.css'
import 'ant-design-vue/dist/reset.css';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { ethers } from 'ethers'
import { Modal,Button, Input, TypographyTitle, Typography } from 'ant-design-vue';

const app = createApp(App)

app.use(Button);
app.use(Modal);
app.use(Input)
app.use(Typography)
app.use(router)
app.mixin({
    mounted: function () {
        //TODO: Config
        if (localStorage.currency == undefined) { localStorage.currency = "USD" }
        if (localStorage.networks == undefined) { localStorage.networks = '["http://127.0.0.1:8545"]' }
        if (localStorage.selectedNetwork == undefined) { localStorage.selectedNetwork = 0 }
        if (localStorage.selectedAccount == undefined) { localStorage.selectedAccount = 0 }
    },
    methods: {
        getAccounts: function () {
            return window.API.GetAccounts();
        },
        getAccount: function(){
            return this.getAccounts(localStorage.selectedAccount)[0];
        },
        getBalance: async function (address) {
            let provider = new ethers.providers.JsonRpcProvider(JSON.parse(localStorage.networks)[localStorage.selectedAccount]);
            return await provider.getBalance(address);
        },
        getEth2Currency: function () {
            return window.API.Eth2Currency(localStorage.currency);
        },
        getJdenticon: function (address, size) {
            return window.API.jdenticon(address, size)
        },
        copyContent: async (text) => {
            try {
                await navigator.clipboard.writeText(text);
            } catch (err) {
                console.error('Failed to copy: ', err);
            }
        },
        wei2Eth: function (value) {
            return value / 1000000000000000000;
        },
        hex2Wei:async function(address){
            return parseInt((await this.getBalance(address))["_hex"], 16)
        },
        toCurrency: function (value) {
            if (typeof value !== "number") {
                return value;
            }
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            });
            return formatter.format(value);
        }
    }
})

app.mount('#app')

//import './assets/cdn.ethers.io_lib_ethers-5.2.umd.min.js';
