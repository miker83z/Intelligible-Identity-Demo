<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h2>Document Details</h2>
        <div v-if="infos.type === 'Identity'">
          <table class="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Id</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ infos.type }}</td>
                <td>{{ infos.name }}</td>
                <td>{{ infos.id }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div v-if="document">
          <v-code-mirror v-model:value="document" :options="cmOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import { VCodeMirror } from "vue3-code-mirror";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/base16-dark.css";

export default {
  components: {
    VCodeMirror,
  },
  data() {
    return {
      infos: "",
      cid: "",
      title: "",
      description: "",
      document: "",
      cmOptions: {
        lineNumbers: true,
        mode: { name: "javascript", json: true },
        theme: "base16-dark",
      },
    };
  },
  computed: {
    ...mapGetters(["getDocumentInfo"]),
  },
  async mounted() {
    this.infos = this.getDocumentInfo({ id: this.$route.params.id });
    this.showLoading({
      loading: true,
      description: "Getting the document from IPFS",
    });
    await this.$ipfs;
    try {
      this.cid = this.$route.params.id;
      this.document = await this.retrieveIPFS({ cid: this.$route.params.id });
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
    ...mapActions(["retrieveIPFS"]),
    ...mapMutations({
      showLoading: "LOADING_SPINNER_SHOW_MUTATION",
    }),
  },
};
</script>

<style>
.CodeMirror {
  height: 100%;
}
</style>
