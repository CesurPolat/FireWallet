<script>
export default {
    data() {
        return {
            obj: {},
            type: "Market",
            networks: [],
            selectedNetwork: 0,
            balance: 0,
            open: false,
            gasPrice: 0,
            maxGas: 0,

        }
    },
    methods: {
        SendTransaction: async function (obj) {
            window.API.WsSend(JSON.stringify(await window.API.SendTransaction(obj)))
            window.close()
        },
        Reject: function (obj) {
            window.API.WsSend(JSON.stringify(obj))
            window.close()
        },
        changeValue: function (e) {
            //TODO: Func
            this.obj.value = e.target.value * 1000000000000000000
        },
        changeGas: function (e, type) {
            //TODO: Func
            this.obj[type] = "0x" + (e.target.value * 1000000000000000000).toString(16)
            console.log(this.obj);


        },

    },
    mounted: async function () {
        this.obj = this.$route.query;
        //TODO: Auto Refresh
        let gas =await this.getFee();
        Object.keys(gas).forEach(function (key, idx){gas[key] = gas[key]._hex})
        //this.obj = { from: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", value: 10000 }
        if (this.obj.gasPrice == undefined) {
            this.obj = { ...this.obj, ...gas };
        } else {
            this.type = "Özel"
        }
        this.gasPrice = this.obj.gasPrice;
        this.maxGas = this.obj.maxFeePerGas;

        //TODO: ?
        this.balance = this.wei2Eth(parseInt((await this.getBalance(this.obj.from))["_hex"], 16));

        this.networks = JSON.parse(localStorage.networks);
        this.selectedNetwork = localStorage.selectedNetwork;



        //TODO: Test
    }
}
</script>

<template>
    <div class="divide-y-2">
        <div class="h-[90vh] divide-y-[1px]">

            <div>
                <div class="flex justify-between p-2 divide-x-2 [&>div]:w-[50vw] [&>div]:justify-center">
                    <div class="flex items-center">
                        <div v-html="getJdenticon(obj.from, 30)" class="cursor-pointer"></div>
                        <h2>{{ obj.from?.slice(0, 5) }}...{{ obj.from?.slice(-4) }}</h2>
                    </div>

                    <div class="flex items-center">
                        <div v-html="getJdenticon(obj.to, 30)" class="cursor-pointer"></div>
                        <h2>{{ obj.to?.slice(0, 5) }}...{{ obj.to?.slice(-4) }}</h2>
                    </div>
                </div>

                <span
                    class="absolute top-3 left-[50vw] bg-white rounded-full border w-5 h-5 ml-[-10px] items-center flex">-></span>
            </div>

            <div class="flex p-2 justify-between items-center">
                <div class="flex">
                    <div class="w-14">Balance:</div> <img src="@/assets/ethereum-eth-logo.svg" alt="ETH"
                        class="w-3 ml-2 mr-2">
                    <div class="whitespace-nowrap overflow-hidden text-ellipsis w-20">{{ balance }}</div>
                </div>
                <div class="border rounded-full p-1">
                    {{ networks[selectedNetwork] }}
                </div>
            </div>
            <div class="flex p-2"><!-- TODO Implemeent to obj -->
                <div class="w-14">Amount: </div><img src="@/assets/ethereum-eth-logo.svg" alt="ETH" class="w-3 ml-2 mr-2">
                <input type="number" @change="changeValue" :value='wei2Eth(obj.value).toFixed(16).replace(/\.?0+$/, "")'
                    class="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none">
            </div>

            <div class="flex p-2 justify-between items-center">
                <div class="flex">
                    <div class="w-20">Gas Price:</div>{{ wei2Eth(parseInt(this.obj.gasPrice,
                        16)).toFixed(16).replace(/\.?0+$/,
                            "") }}
                </div>
                <div>
                    <button class=" text-red-500 hover:underline" @click="open = !open">{{ type }} ></button>
                    <a-modal v-model:open="open" title="Import Wallet" class="modal" @ok="gasPrice = obj.gasPrice; maxFeePerGas = obj.maxGas; open = !open"
                        @cancel="obj.gasPrice = gasPrice; obj.maxFeePerGas = maxGas"><!-- TODO: ???? Cancel Big Problem -->
                        <a-input :value='wei2Eth(obj.maxFeePerGas).toFixed(16).replace(/\.?0+$/, "")'
                            @change="(event) => changeGas(event, 'maxFeePerGas')" type="number" class="mb-2"
                            placeholder="Gas Limit" />
                        <a-input :value='wei2Eth(obj.gasPrice).toFixed(16).replace(/\.?0+$/, "")'
                            @change="(event) => changeGas(event, 'gasPrice')" type="number" class="mb-2"
                            placeholder="Gas Price" />
                    </a-modal>
                </div>
            </div>
            <div class="flex p-2">
                <div class="w-20">Total:</div>{{ wei2Eth(parseInt(this.obj.gasPrice, 16) +
                    obj.value).toFixed(16).replace(/\.?0+$/, "") }}
            </div>

        </div>
        <div class="h-[10vh] flex items-center justify-around text-xl [&>*]:p-1">
            <button @click="Reject({ msg: 'User Rejected Transaction' })"
                class="border border-red-500 text-red-500 rounded-full w-[40vw]">Reject</button>
            <button @click="SendTransaction({...obj})"
                class="bg-red-500 text-white rounded-full w-[40vw] hover:opacity-90 disabled:bg-red-800"
                :disabled="wei2Eth(obj.value) > balance">Confirm</button>
        </div>

    </div>
</template>