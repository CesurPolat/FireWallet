<script setup>
import { RouterLink, RouterView } from 'vue-router'
import FireLoading from './components/FireLoading.vue';
import {loading} from './store/loading.js'
</script>

<template>
  <RouterView />
  <FireLoading v-if="loading.value"/>
</template>

<style scoped>

</style>
