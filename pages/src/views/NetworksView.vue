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
            this.selectedNetwork=this.selectedNetwork
            //TODO: Loading
            window.API.SetProvider(this.networks[this.selectedNetwork]);
        }
    },
    mounted: function () {
        this.networks=JSON.parse(localStorage.networks);
        this.selectedNetwork=localStorage.selectedNetwork;

    }
};

</script>

<template>
    <!-- TODO: Text Size-->
    <select
        class="bg-transparent border rounded-full p-1 text-white text-sm" @change="changeNetwork">
        <!-- TODO: Text Color -->
        <option v-for="network,i in networks" :selected="selectedNetwork == i" v-bind:value="i" class="text-black">{{ network }}</option>
    </select>
</template>
  
  