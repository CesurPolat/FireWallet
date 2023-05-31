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
            window.API.SetNetworks(this.selectedNetwork)
        }
    },
    mounted: function () {
        this.networks=window.API.GetNetworks();
        this.selectedNetwork=window.API.GetSelectedNetwork();
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
  
  