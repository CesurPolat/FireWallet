<script>

export default{
    data:function(){
        return{
            pass:''
        }
    },
    methods:{
        unlock:function(){
            if(window.API.Unlock(this.pass)){
                this.$router.push("home");
            }else{
                //TODO: Validation
            }
        }
    }
}
    
</script>

<template>
    <div class="flex flex-col items-center">
            <h1>Unlock Wallet</h1>
            <input type="password" v-model="pass"
                class="border rounded-full p-2 pl-5 pr-5 w-64 focus:border-red-500 outline-none transition-all">
            <button class="bg-red-500 text-white w-64 m-5 p-2 rounded-full" @click="unlock()">Unlock</button>
        </div>
</template>