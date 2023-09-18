<script>
import { ethers } from "ethers";
import NetworksView from "./NetworksView.vue";
import { SendOutlined } from "@ant-design/icons-vue";
import { ref } from "vue";
const activeKey = ref("1");

export default {
  data: function () {
    return {
      pageShow: "home",
      profile: false,
      sendAddress: "",
      currency: 0,
      accounts: [],
      balance: 0,
      open: false,
      privateKey: "",
      pass: "",
      lStorage: ref(localStorage),
    };
  },
  methods: {
    //TODO: GLOB
    isAdress: function (address) {
      return ethers.isAddress(address);
    },
    isPrivate: function (key) {
      return ethers.utils.isHexString(key, 32);
    },
    goSend: function (e) {
      if (this.isAdress(e.target.value)) {
        this.pageShow = "send";
        this.sendAddress = e.target.value;
      }
    },
    lockWallet: function () {
      window.API.Lock();
      this.$router.push("unlock");
    },
    clearData: function () {
      window.API.ClearData();
      this.$router.push("create");
    },
    createAccount: function () {
      window.API.incAccount();
      //TODO: Refresh Account After Increased
      this.$forceUpdate();
    },
    importWallet: function (key, pass) {
      if (!this.isPrivate(key)) {
        return null;
      }
      if (window.API.Unlock(pass)) {
        window.API.ImportAccount(key, pass);
      }
    },
    getBalanceEther: async function () {
      this.balance = this.wei2Eth(
        parseInt((await this.getBalance(this.getAccount()))["_hex"], 16)
      );
    },
  },
  filters: {},
  computed: function () {},
  mounted: async function () {
    this.currency = this.getEth2Currency();
    this.accounts = this.getAccounts();

    this.getBalanceEther();
    setInterval(() => {
      this.currency = this.getEth2Currency();
    }, 10000);
  },
  components: { NetworksView, SendOutlined },
};
</script>

<template>
  <div
    @click="profile = !profile"
    class="z-10 absolute w-full h-full"
    v-if="profile"
  >
     
  </div>
  <header class="bg-red-500 p-2 flex items-center justify-between">
    <img src="@/assets/logoWhite.png" alt="Logo" class="w-6" />
    <!-- <h1 class="text-white ml-2 text-xl font-bold">FIREWALLET</h1> -->
    <div class="flex items-center">
      <NetworksView></NetworksView>
      <div class="ml-2">
        <div
          v-html="getJdenticon(getAccount())"
          class="cursor-pointer"
          @click="profile = !profile"
        ></div>
        <div
          class="absolute right-1 bg-gray-800 bg-opacity-40 text-white rounded-sm divide-y-2 divide-gray-100 [&>*]:m-1 w-40 z-20 overflow-hidden"
          v-show="profile"
        >
          <div class="flex items-center justify-between">
            <h1>Account</h1>
            <button
              @click="lockWallet()"
              class="border border-red-500 rounded-full text-red-500 pl-2 pr-2"
            >
              Lock
            </button>
          </div>
          <div>
            <!-- TODO: Overflow text -->
            <div
              class="flex items-center"
              v-for="(account, idx) in getAccounts()"
              :key="idx"
            >
              <!-- TODO: Func -->
              <div
                v-html="getJdenticon(account, 30)"
                class="cursor-pointer"
                @click="
                  lStorage.selectedAccount = idx;
                  profile = false;
                  getBalanceEther();
                "
              ></div>
              {{ account }}
            </div>
          </div>
          <div>
            <button @click="createAccount()">Create Account</button>
          </div>
          <div>
            <button @click="open = !open">Import Wallet</button>
            <a-modal
              v-model:open="open"
              title="Import Wallet"
              class="modal"
              @ok="
                importWallet(privateKey, pass);
                privateKey = '';
                pass = '';
                open = false;
              "
              @cancel="
                privateKey = '';
                pass = '';
              "
            >
              <a-input
                v-model:value="privateKey"
                class="mb-2"
                placeholder="Private Key"
              />
              <a-input
                v-model:value="pass"
                type="password"
                class="mb-2"
                placeholder="Password"
              />
            </a-modal>
          </div>
          <div>
            <button @click="clearData()">Clear Data</button>
          </div>
        </div>
      </div>
    </div>
  </header>

  <div>
    <div class="flex flex-col items-center" v-if="pageShow == 'home'">

      <a-tooltip placement="bottom">
        <template #title>
          <span>Click To Copy</span>
        </template>
        <div class="w-full flex flex-col items-center bg-red-100">
          <!-- TODO:Reopen -->
          <div
            class="hover:bg-red-400 rounded-md p-1 m-1 flex flex-col items-center text-sm cursor-pointer"
            @click="copyContent(getAccount())"
          >
            <h1>Account</h1>
            <h2 class="whitespace-nowrap overflow-hidden text-ellipsis w-24">
              {{ getAccount() }}
            </h2>
          </div>
        </div>
      </a-tooltip>

      <h1 class="text-3xl">{{ balance }} ETH</h1>
      <h2>{{ toCurrency(currency * balance) }}</h2>
      <div class="flex text-xl">
        <div
          class="flex flex-col items-center cursor-pointer m-1"
          @click="pageShow = 'contacts'"
        >
          <SendOutlined class="bg-red-500 rounded-full m-1 p-1 text-white" />
          <h2 class="text-red-500">Send</h2>
        </div>
      </div>

      <a-tabs v-model:activeKey="activeKey" centered>
        <a-tab-pane key="1" tab="History" force-render> History </a-tab-pane>
        <a-tab-pane key="2" tab="NFTs"> NFT </a-tab-pane>
      </a-tabs>

      <!-- Bottom -->
    </div>

    <div v-show="pageShow == 'contacts'">
      <div class="flex justify-between items-center text-center mt-3">
        <h1 class="w-1/3"> </h1>
        <h1 class="w-1/3 text-xl">Send to</h1>
        <button @click="pageShow = 'home'" class="w-1/3 text-red-500">
          Cancel
        </button>
      </div>
      <div class="p-2">
        <input
          type="text"
          class="w-full border rounded-full p-2 pl-5 pr-5 focus:border-red-500 outline-none transition-all"
          placeholder="0x"
          @change="goSend"
        />
      </div>
    </div>

    <div v-if="pageShow == 'send'">
      Send to
      {{ sendAddress }}
      <input type="number" name="" id="" />
    </div>
  </div>
</template>
