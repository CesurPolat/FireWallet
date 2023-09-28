<script>
import NetworksView from "../components/NetworksView.vue";

export default {
  data: function () {
    return {
      pass: "",
    };
  },
  methods: {
    unlock: async function () {
        /* TODO: Fix */
      this.setLoading(true);
      this.$forceUpdate();
      const tempRouter = this.$router;
      const tempLoading = this.setLoading;
      window.API.Unlock(this.pass).then((data) => {
        if (data) {
          tempRouter.push("home");
        } else {
          //TODO: Validation
          alert("Wrong Password");
        }
        tempLoading(false);
      });
    },
  },
  components: { NetworksView },
};
</script>

<template>
  <header class="bg-red-500 mb-5 p-2 flex items-center">
    <img src="@/assets/logoWhite.png" alt="Logo" class="w-6" />
    <h1 class="text-white ml-2 text-xl font-bold">FIREWALLET</h1>
    <NetworksView class="fixed right-1"></NetworksView>
  </header>
  <div class="flex flex-col items-center">
    <h1>Unlock Wallet</h1>
    <input
      type="password"
      v-model="pass"
      class="border rounded-full p-2 pl-5 pr-5 w-64 focus:border-red-500 outline-none transition-all"
    />

    <button
      class="bg-red-500 text-white w-64 m-5 p-2 rounded-full"
      @click="unlock()"
    >
      Unlock
    </button>
    <router-link
      to="create"
      class="font-medium text-red-600 underline dark:text-red-500 hover:no-underline"
      >Forgot Password?</router-link
    >
  </div>
  <div class="flex flex-col items-center fixed bottom-0 left-0 right-0">
    <a href="https://github.com/CesurPolat" target="_blank"
      >github.com/CesurPolat</a
    >
  </div>
</template>
