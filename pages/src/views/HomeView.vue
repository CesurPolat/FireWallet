<script>
    export default{
        methods:{
            getBalance:function(){
                return parseInt((window.API.GetBalance())._hex)/1000000000000000000;
            },
            clearData:function(){
                window.API.ClearData();
                this.$router.push("create")
            }
        },
        mounted:function(){
        }
    }
</script>

<template>
    FireWallet
    <h1>Balance:{{ getBalance() }}ETH</h1>
    <button @click="clearData()">Clear Data</button>
</template>