<script>
export default {
    data: function () {
        return {
            obj:{},
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
        Confirm:async (obj)=>{
            window.API.WsSend(JSON.stringify(await window.API.SignMessage(obj)));
            window.close();
        }
    },
    mounted: async function () {
        this.obj = this.$route.query;

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
            {{ obj.name }}
        </div>
        <a-typography-title :level="3">Sign Message</a-typography-title>
        <a-typography-text class="text-center">Only sign this message if you fully understand the content and trust the requesting site.</a-typography-text>

        <div class="border rounded m-5">
            <a-typography-title :level="4">Message:</a-typography-title>
            {{ obj.message }}
        </div>
        
    </div>
    <div class="h-[10vh] flex items-center justify-around text-xl [&>*]:p-1">
            <button @click="Reject({ msg: 'User Rejected' })"
                class="border border-red-500 text-red-500 rounded-full w-[40vw]">Reject</button>
            <button @click="Confirm({...obj})"
                class="bg-red-500 text-white rounded-full w-[40vw] hover:opacity-90 disabled:bg-red-800"
                :disabled="wei2Eth(obj.value) > balance">Confirm</button>
        </div>
</template>