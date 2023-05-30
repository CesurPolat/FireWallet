<script>
    export default{
        data() {
            return{
                obj:{}
            }
        },
        methods:{
            SendTransaction:function(obj){
                window.API.SendTransaction(obj)
                window.close()
            }
        },
        mounted:function(){
            this.obj=this.$route.query;
        }
    }
</script>

<template>
    {{ this.$route.query.to }}
    <button @click="SendTransaction(this.$route.query)">aaa</button>
</template>