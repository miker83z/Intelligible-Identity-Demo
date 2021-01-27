<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h2>Identities Details</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="identity in identityFiles" :key="identity">
              <td>{{ identity["name"] }}</td>
              <td>
                <router-link :to="`/documents/${identity['id']}`">{{
                  identity["id"]
                }}</router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <h2>Documents List</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Doc URI</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="certificate in certificateFiles" :key="certificate">
              <td>{{ certificate["name"] }}</td>
              <td>
                <router-link :to="`/documents/${certificate['id']}`">{{
                  certificate["id"]
                }}</router-link>
              </td>
              <td>
                <router-link :to="`/documents/${certificate['docURI']}`">{{
                  certificate["docURI"]
                }}</router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  computed: {
    ...mapState({
      identityFiles: (state) => state.identityFiles,
      certificateFiles: (state) => state.certificateFiles,
    }),
  },
  async mounted() {
    this.showLoading({
      loading: true,
      description: "Getting files from IPFS",
    });
    await this.$ipfs;
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
