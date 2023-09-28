<script>

export default {
    data: function () {
        return {
            networks: [],
            selectedNetwork:0
        }
    },
    methods:{
        changeNetwork: function(e){
            this.selectedNetwork = e.target.value
            localStorage.selectedNetwork=this.selectedNetwork;
            this.$router.go(0);
            //TODO: Loading
            window.API.SetProvider(JSON.parse(localStorage.networks)[this.selectedNetwork]);
        }
    },
    mounted: function () {
        this.networks=JSON.parse(localStorage.networks);
        this.selectedNetwork=localStorage.selectedNetwork;

    }
};

</script>

<template>
    <select
        class="bg-transparent border rounded-full p-1 text-white text-sm overflow-hidden w-40 outline-none" @change="changeNetwork">
        <option v-for="network,i in networks" :selected="selectedNetwork == i" v-bind:value="i" class="text-black">{{ network }}</option>
    </select>
</template>
  
  