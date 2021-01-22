<template>
  <Loader v-if="showLoading"></Loader>
  <Navigation />
  <div class="alert alert-danger" v-if="noProvider">
    Please install MetaMask! -> More info
    <router-link to="/metamask">here</router-link>
  </div>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div>
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from "./components/Navigation.vue";
import { mapState } from "vuex";
import { defineAsyncComponent } from "vue";

const Loader = defineAsyncComponent(() =>
  import(/* webpackChunkName: "Loader" */ "./components/Loader.vue")
);

export default {
  name: "App",
  computed: {
    ...mapState({
      showLoading: (state) => state.showLoading,
      noProvider: (state) => !state.web3Provider,
    }),
  } /*
  watch: {
    autoLogout(curValue, oldValue) {
      if (curValue && curValue != oldValue) {
        this.$router.replace("/login");
      }
    },
  },*/,
  components: {
    Navigation,
    Loader,
  },
  created() {
    const ipfs = this.$ipfs;
    this.$store.dispatch(`checkWeb3Provider`);
    this.$store.dispatch("initIPFS", { ipfs });
  },
};
</script>

