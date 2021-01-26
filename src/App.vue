<template>
  <Loader v-if="showLoading"></Loader>
  <Navigation />
  <div class="alert alert-danger" v-if="noProvider">
    Please install MetaMask! -> More info
    <router-link to="/metamask">here</router-link>
  </div>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import Navigation from "./components/Navigation.vue";
import { mapState, mapGetters, mapActions } from "vuex";
import { defineAsyncComponent } from "vue";

const Loader = defineAsyncComponent(() =>
  import(/* webpackChunkName: "Loader" */ "./components/Loader.vue")
);

export default {
  name: "App",
  computed: {
    ...mapState({
      showLoading: (state) => state.showLoading,
      web3Provider: (state) => state.web3Provider,
    }),
    ...mapGetters(["noProvider"]),
  },
  watch: {
    noProvider(curValue, oldValue) {
      if (curValue) {
        setTimeout(this.checkWeb3Provider(), 3000);
      } else if (!curValue && curValue != oldValue) {
        this.web3Provider.on("connect", () => this.checkWeb3Provider());
        this.web3Provider.on("disconnect", () => this.checkWeb3Provider());
      }
    },
  },
  components: {
    Navigation,
    Loader,
  },
  created() {
    const ipfs = this.$ipfs;
    this.checkWeb3Provider();
    this.initIPFS({ ipfs });
  },
  methods: {
    ...mapActions(["checkWeb3Provider", "initIPFS"]),
  },
};
</script>

