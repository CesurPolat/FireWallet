<script>
export default {
    data: function () {
        return {
            accounts: [],
            //TODO:Fix
            balance: [],

        }
    },
    methods: {
        Reject:()=>{
            //TODO: Edit
            window.API.WsSend("Rejected");
            window.close()
        },
        Confirm:(address)=>{
            window.API.WsSend(address);
            window.close();
        }
    },
    mounted: async function () {
        this.accounts = this.getAccounts();
        for (let i = 0; i < this.accounts.length; i++) {
            this.balance.push(this.wei2Eth(await this.hex2Wei(this.accounts[i])))

        }
    }
}
</script>

<template>
    <div class="flex flex-col items-center h-[90vh]">
        <div class="rounded-full border flex flex-row justify-center items-center m-5 p-2 pl-5 pr-5 [&>*]:pr-5 ">
            <img src="../assets/logo.png" alt="" class="h-8 w-10">
            http://localhost/
        </div>
        <a-typography-title :level="3">Connect with FireWallet</a-typography-title>
        <a-typography-text>Select the account(s) to use on this site</a-typography-text>

        <div class="text-center border rounded-lg [&>*]:border-b [&>*]:p-1 overflow-hidden mt-5 max-h-[50vh]">
            <div v-for="account, idx in accounts" class="flex items-center hover:bg-red-300" @click="Confirm(account)">
                <div v-html="getJdenticon(account)" class="cursor-pointer"></div>
                <div>
                    <h2 class="whitespace-nowrap overflow-hidden text-ellipsis w-56 m-0">{{ account }}</h2>
                    <p class="m-0 text-left ">{{ balance[idx] }} ETH</p><!-- TODO: Do not show if ether 0 -->
                </div>
            </div>
        </div>

        
    </div>
    <div class="h-[10vh] flex items-center justify-around text-xl [&>*]:p-1 border-t">
            <!-- @click="Reject({ port: obj.port, msg: 'User Rejected Transaction' })" -->
            <button @click="Reject()" class="border border-red-500 text-red-500 rounded-full w-[80vw]">Reject</button>
            <!-- @click="SendTransaction(this.$route.query)" :disabled="wei2Eth(obj.value) > getBalance()" -->
            <!-- <button
                class="bg-red-500 text-white rounded-full w-[40vw] hover:opacity-90 disabled:bg-red-800">Confirm</button> -->
        </div>
</template>