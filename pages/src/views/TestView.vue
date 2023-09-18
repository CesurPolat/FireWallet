<script>
import { RouterLink } from "vue-router";

export default {
  methods: {
    createAccount: function () {
      window.API.incAccount();
      this.$forceUpdate();
    },
  },
};
</script>

<template>
  <RouterLink to="home">Back</RouterLink><br />
  <button @click="createAccount()">Add</button>
  <h1 v-for="(acc, idx) in getAccounts()">{{ acc }}</h1>
</template>
