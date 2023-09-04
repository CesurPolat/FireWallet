<script>
import { ethers } from 'ethers';
import NetworksView from './NetworksView.vue';
const et = ethers;




export default {
    data: function () {
        return {
            pageShow: "home",
            profile: false,
            sendAddress: "",
            currency: 0,
            accounts: [],
            balance: 0,
            open: false,
            privateKey: "",
            pass: "",

        }
    },
    methods: {
        //TODO: GLOB
        isAdress: function (address) {
            return ethers.isAddress(address)
        },
        isPrivate: function (key) {
            return et.isHexString(key, 32);
        },
        goSend: function (e) {
            if (this.isAdress(e.target.value)) {
                this.pageShow = "send";
                this.sendAddress = e.target.value;
            }
        },
        lockWallet: function () {
            window.API.Lock()
            this.$router.push("unlock")
        },
        clearData: function () {
            window.API.ClearData();
            this.$router.push("create");
        },
        createAccount: function () {
            window.API.incAccount();
            //TODO: Refresh Account After Increased
            this.$forceUpdate();
        },
        importWallet: function (key, pass) {
            if (!this.isPrivate(key)) { return null }
            if (window.API.Unlock(pass)) {
                window.API.importWallet(key, pass)
            }
        },

    },
    filters: {

    },
    computed: function () {

    },
    mounted: async function () {
        this.currency = this.getEth2Currency()
        this.accounts = this.getAccounts()
        //TODO:Balance Eth
        this.balance = this.wei2Eth(parseInt((await this.getBalance(this.getAccount()))["_hex"], 16));

        setInterval(() => {
            this.currency = this.getEth2Currency()
        }, 10000);


    },
    components: { NetworksView }
}
</script>

<template>
    <div @click="profile = !profile" class="z-10 absolute w-full h-full" v-if="profile"> </div>
    <header class="bg-red-500 p-2 flex items-center justify-between">
        <img src="@/assets/logoWhite.png" alt="Logo" class="w-6">
        <!-- <h1 class="text-white ml-2 text-xl font-bold">FIREWALLET</h1> -->
        <div class="flex items-center">
            <NetworksView></NetworksView>
            <div class="ml-2">
                <div v-html="getJdenticon(getAccount())" class="cursor-pointer" @click="profile = !profile"></div>
                <div class="absolute right-1 bg-gray-800 bg-opacity-40 text-white rounded-sm divide-y-2 divide-gray-100 [&>*]:m-1 w-40 z-20 overflow-hidden"
                    v-show="profile">
                    <div class="flex items-center justify-between">
                        <h1>Account</h1>
                        <button @click="lockWallet()"
                            class="border border-red-500 rounded-full text-red-500 pl-2 pr-2">Lock</button>
                    </div>
                    <div>
                        <!-- TODO: Overflow text -->
                        <div @click="" class="flex items-center" v-for="account, idx in getAccounts()">
                            <div v-html="getJdenticon(account, 30)" class="cursor-pointer"
                                @click="localStorage.selectedAccout = idx"></div>{{ account }}
                        </div>
                    </div>
                    <div>
                        <button @click="createAccount()">Create Account</button>
                    </div>
                    <div><!-- TODO Fix important -->
                        <button @click="open = !open">Import Wallet</button>
                        <a-modal v-model:open="open" title="Import Wallet" class="modal"
                            @ok="importWallet(privateKey, pass); privateKey = ''; pass = ''" @cancel="privateKey = ''; pass = ''">
                            <a-input v-model:value="privateKey" class="mb-2" placeholder="Private Key" />
                            <a-input v-model:value="pass" type="password" class="mb-2" placeholder="Password" />
                        </a-modal>
                    </div>
                    <div>
                        <button @click="clearData()">Clear Data</button>

                    </div>
                </div>
            </div>
        </div>

    </header>

    <div>
        <div class="flex flex-col items-center" v-if="pageShow == 'home'">
            <!-- TODO: Popover -->
            <div class="w-full flex flex-col items-center bg-red-100">
                <!-- TODO:Reopen -->
                <div class="hover:bg-red-400 rounded-md p-1 m-1 flex flex-col items-center text-sm cursor-pointer"
                    @click="copyContent(getAccount())">
                    <h1>Account</h1>
                    <h2 class="whitespace-nowrap overflow-hidden text-ellipsis w-24">{{ getAccount() }}</h2>
                </div>
            </div>

            <h1 class="text-3xl">{{ balance }} ETH</h1>
            <!-- TODO: Every Click Event Trigger it -->
            <h2>{{ toCurrency(currency * balance) }}</h2>
            <div class="flex text-xl">

                <div class="flex flex-col items-center cursor-pointer m-1">
                    <!-- TODO: Svg to file -->
                    <svg class="bg-red-500 rounded-full m-1 p-1 text-3xl text-white" viewBox="64 64 896 896"
                        focusable="false" fill="currentColor" width="1em" height="1em" data-icon="send" aria-hidden="true">
                        <defs>
                        </defs>
                        <path
                            d="M931.4 498.9L94.9 79.5c-3.4-1.7-7.3-2.1-11-1.2a15.99 15.99 0 00-11.7 19.3l86.2 352.2c1.3 5.3 5.2 9.6 10.4 11.3l147.7 50.7-147.6 50.7c-5.2 1.8-9.1 6-10.3 11.3L72.2 926.5c-.9 3.7-.5 7.6 1.2 10.9 3.9 7.9 13.5 11.1 21.5 7.2l836.5-417c3.1-1.5 5.6-4.1 7.2-7.1 3.9-8 .7-17.6-7.2-21.6zM170.8 826.3l50.3-205.6 295.2-101.3c2.3-.8 4.2-2.6 5-5 1.4-4.2-.8-8.7-5-10.2L221.1 403 171 198.2l628 314.9-628.2 313.2z">
                        </path>
                    </svg>
                    <h2 @click="pageShow = 'contacts'" class="text-red-500">Send</h2>
                </div>


            </div>

            <!-- Bottom -->
        </div>

        <div v-show="pageShow == 'contacts'">
            <div class="flex justify-between items-center text-center mt-3">
                <h1 class="w-1/3"> </h1>
                <h1 class="w-1/3 text-xl">Send to</h1>
                <button @click="pageShow = 'home'" class="w-1/3 text-red-500">Cancel</button>
            </div>
            <div class="p-2">
                <input type="text"
                    class="w-full border rounded-full p-2 pl-5 pr-5 focus:border-red-500 outline-none transition-all"
                    placeholder="0x" @change="goSend">
            </div>
        </div>

        <div v-if="pageShow == 'send'">
            Send to
            {{ sendAddress }}
            <input type="number" name="" id="">
        </div>
    </div>
</template>