<script>
export default {
    data() {
        return {
            obj: {},
            type: "Market",
            networks: [],
            selectedNetwork: 0
        }
    },
    methods: {
        SendTransaction: function (obj) {
            window.API.SendTransaction(obj)
            window.close()
        },
        Reject: function (obj) {
            window.API.SendTransaction(obj)
            window.close()
        },
        changeValue: function (e) {
            //TODO: Func
            this.obj.value = e.target.value * 1000000000000000000
        },
    },
    mounted: function () {
        this.obj = this.$route.query;
        this.obj = { from: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", value: 10000 }
        if (this.obj.gasPrice == undefined) {
            this.obj = { ...this.obj, ...window.API.GetFee() };
        } else {
            this.type = "Özel"
        }

        //TODO: modular
        this.networks = window.API.GetNetworks();
        this.selectedNetwork = window.API.GetSelectedNetwork();



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
                        <div v-html="getJdenticon(obj.to, 30)" class="cursor-pointer"></div>
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
                    {{ getBalance() }}
                </div>
                <div class="border rounded-full p-1">
                    {{ networks[selectedNetwork] }}
                </div>
            </div>
            <div class="flex p-2">
                <div class="w-14">Amount: </div><img src="@/assets/ethereum-eth-logo.svg" alt="ETH" class="w-3 ml-2 mr-2">
                <input type="number" @change="changeValue" :value='wei2Eth(obj.value).toFixed(16).replace(/\.?0+$/, "")'
                    class="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none">
            </div>

            <div class="flex p-2 justify-between items-center">
                <div class="flex">
                    <div class="w-20">Gas Price:</div>{{ wei2Eth(parseInt(this.obj.gasPrice?._hex,
                    16)).toFixed(16).replace(/\.?0+$/,
                        "") }}
                </div>
                <div>
                    <button class=" text-red-500 hover:underline">{{ type }} ></button>
                </div>
            </div>
            <div class="flex p-2">
                <div class="w-20">Total:</div>{{ wei2Eth(parseInt(this.obj.gasPrice?._hex, 16) +
                    obj.value).toFixed(16).replace(/\.?0+$/, "") }}
            </div>

        </div>
        <div class="h-[10vh] flex items-center justify-around text-xl [&>*]:p-1">
            <button @click="Reject({ port: obj.port, msg: 'User Rejected Transaction' })"
                class="border border-red-500 text-red-500 rounded-full w-[40vw]">Reject</button>
            <button @click="SendTransaction(this.$route.query)"
                class="bg-red-500 text-white rounded-full w-[40vw] hover:opacity-90 disabled:bg-red-800"
                :disabled="wei2Eth(obj.value) > getBalance()">Confirm</button>
        </div>

    </div>
</template>