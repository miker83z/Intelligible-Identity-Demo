<template>
  <h2>Identities Details</h2>
  <table class="table">
    <thead>
      <tr>
        <th>Id</th>
        <th>Title</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="identity in identityFiles" :key="identity">
        <td>{{ identity }}</td>
        <td>TODO</td>
        <td>TODO</td>
      </tr>
    </tbody>
  </table>

  <h2>Certificates Details</h2>
  <table class="table">
    <thead>
      <tr>
        <th>Id</th>
        <th>Title</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="identity in identityFiles" :key="identity">
        <td>{{ identity }}</td>
        <td>TODO</td>
        <td>TODO</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
export default {
  computed: {
    ...mapState({
      identityFiles: (state) => state.identityFiles,
      cartificateFiles: (state) => state.cartificateFiles,
    }),
    ...mapGetters({
      token: "getToken",
    }),
  },
  async mounted() {
    this.showLoading({
      loading: true,
      description: "Getting files from IPFS",
    });
    try {
      this.retrieveAllFilesIPFS();
    } catch (err) {
      console.log(err);
    } finally {
      this.showLoading({
        loading: false,
        description: " ",
      });
    }
  },
  methods: {
    ...mapActions(["retrieveAllFilesIPFS"]),
    ...mapMutations({
      showLoading: "LOADING_SPINNER_SHOW_MUTATION",
    }),
  },
};
</script>

<style scoped></style>
