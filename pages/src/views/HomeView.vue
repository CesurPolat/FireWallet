<script>
import NetworksView from './networksView.vue';

export default {
    data: function () {
        return {
            currency: 1
        }
    },
    methods: {
        getBalance: function () {
            return parseInt((window.API.GetBalance())._hex) / 1000000000000000000;
        },
        getAddress: function () {
            return window.API.GetAddress();
        },
        getEth2Currency: function () {
            return window.API.Eth2Currency();
        },
        getJdenticon: function () {
            return window.API.jdenticon(this.getAddress())
        },
        clearData: function () {
            window.API.ClearData();
            this.$router.push("create");
        },
        copyContent: async (text) => {
            try {
                await navigator.clipboard.writeText(text);
            } catch (err) {
                console.error('Failed to copy: ', err);
            }
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
    },
    filters: {

    },
    mounted: function () {

    },
    components: { NetworksView }
}
</script>

<template>
    <header class="bg-red-500 p-2 flex items-center justify-between">
        <img src="@/assets/logoWhite.png" alt="Logo" class="w-6">
        <!-- <h1 class="text-white ml-2 text-xl font-bold">FIREWALLET</h1> -->
        <div class="flex items-center">
            <NetworksView></NetworksView>
            <div v-html="getJdenticon()" class="ml-2 cursor-pointer"></div>
        </div>

    </header>
    <div class="flex flex-col items-center">
        <!-- TODO: Popover -->
        <div class="w-full flex flex-col items-center bg-red-100">
            <div class="hover:bg-red-400 rounded-md p-1 m-1 flex flex-col items-center text-sm cursor-pointer"
                @click="copyContent(getAddress())">
                <h1>Account</h1>
                <h2 class="whitespace-nowrap overflow-hidden text-ellipsis w-24">{{ getAddress() }}</h2>
            </div>
        </div>

        <h1 class="text-3xl">{{ getBalance() }} ETH</h1>
        <h2>{{ toCurrency(getEth2Currency() * getBalance()) }}</h2>
        <div class="flex text-xl">

            <div class="flex flex-col items-center cursor-pointer m-1">
                <svg class="bg-red-500 rounded-full m-1 p-1 text-3xl text-white" viewBox="64 64 896 896" focusable="false" fill="currentColor" width="1em" height="1em" data-icon="send"
                    aria-hidden="true">
                    <defs>
                    </defs>
                    <path
                        d="M931.4 498.9L94.9 79.5c-3.4-1.7-7.3-2.1-11-1.2a15.99 15.99 0 00-11.7 19.3l86.2 352.2c1.3 5.3 5.2 9.6 10.4 11.3l147.7 50.7-147.6 50.7c-5.2 1.8-9.1 6-10.3 11.3L72.2 926.5c-.9 3.7-.5 7.6 1.2 10.9 3.9 7.9 13.5 11.1 21.5 7.2l836.5-417c3.1-1.5 5.6-4.1 7.2-7.1 3.9-8 .7-17.6-7.2-21.6zM170.8 826.3l50.3-205.6 295.2-101.3c2.3-.8 4.2-2.6 5-5 1.4-4.2-.8-8.7-5-10.2L221.1 403 171 198.2l628 314.9-628.2 313.2z">
                    </path>
                </svg>
                <h2 class="text-red-500">Send</h2>
            </div>
            

        </div>
    </div>

    <button @click="clearData()">Clear Data</button>
</template>