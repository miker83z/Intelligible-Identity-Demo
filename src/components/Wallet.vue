<template>
  <sidebar-menu :menu="menu" theme="white-theme" width="500px" rtl collapsed />
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "App",
  computed: {
    ...mapGetters(["getIntelligibleIdentity", "getWeb3URI"]),
  },
  created() {
    this.menu[1].title = this.getIntelligibleIdentity.information.name;
    this.menu[2].title = this.getIntelligibleIdentity.information.email;
    this.menu[3].child[0].title = this.getIntelligibleIdentity.web3.address;
    this.menu[4].href = "/documents/" + this.getWeb3URI;
  },
  data() {
    return {
      menu: [
        {
          header: "Identity Wallet",
          hiddenOnCollapse: true,
        },
        {
          title: "this.getIntelligibleIdentity.information.name",
          icon: "zmdi zmdi-account material-icons-name",
        },
        {
          title: "Your Email",
          icon: "zmdi zmdi-email",
        },
        {
          title: "Ethereum Address",
          icon: "zmdi zmdi-lock",
          child: [
            {
              title: "Your Ethereum Address",
            },
          ],
        },
        {
          href: "/",
          title: "Go to Metadata Document ->",
          icon: "zmdi zmdi-account material-icons-name",
        },
      ],
    };
  },
};
</script>
