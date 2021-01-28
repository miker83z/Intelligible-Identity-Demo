<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h2>Document Details</h2>
        <div v-if="infos !== undefined && infos.type === 'Identity'">
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
        <div v-else-if="infos !== undefined && infos.type === 'Certificate'">
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
    <div
      class="row"
      v-if="
        isAuthenticated &&
        getIntelligibleIdentity &&
        receiverWeb3Adress &&
        getIntelligibleIdentity.web3.address === receiverWeb3Adress
      "
    >
      <div class="col-md-12">
        <form @submit.prevent="onSign()" class="register-form" id="sign-form">
          <div class="form-group form-button">
            <input
              type="submit"
              name="sign"
              id="sign"
              class="form-submit"
              value="Sign it"
            />
          </div>
          <br />
          <br />
        </form>
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
import { IntelligibleCertificate } from "@intelligiblesuite/certificates";
import { IntelligibleIdentity } from "@intelligiblesuite/identity";
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
      receiverWeb3Adress: "",
      title: "",
      description: "",
      document: "",
      documentObj: "",
      cmOptions: {
        lineNumbers: true,
        mode: { name: "javascript", json: true },
        theme: "base16-dark",
      },
    };
  },
  computed: {
    ...mapGetters([
      "getDocumentInfo",
      "isAuthenticated",
      "getIntelligibleIdentity",
    ]),
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
      if (this.infos !== undefined && this.infos.type === "Certificate") {
        this.documentObj = new IntelligibleCertificate();
        this.documentObj.fromStringAKN(this.document);
        const cidString = this.documentObj.akn.metaAndMain.akomaNtoso.doc.meta.references.TLCPerson.find(
          (t) => t["@showAs"] == "EntityOwner"
        )["@href"];
        const ownerIdCid = cidString.split("##")[1];
        const ownerIdDoc = await this.retrieveIPFS({ cid: ownerIdCid });
        const iid = new IntelligibleIdentity();
        iid.fromStringAKN(ownerIdDoc);
        const ownerAddress = iid.akn.metaAndMain.akomaNtoso.doc.mainBody.tblock.find(
          (t) => t["@eId"] == "tblock_2"
        ).p.addressWeb3;
        this.receiverWeb3Adress = ownerAddress;
      }
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
    ...mapActions(["retrieveIPFS", "signCertificate"]),
    ...mapMutations({
      showLoading: "LOADING_SPINNER_SHOW_MUTATION",
    }),
    async onSign() {
      //make spinner true
      this.showLoading({
        loading: true,
        description: "Signing...",
      });
      try {
        const cid = await this.signCertificate({ ice: this.documentObj });
        this.$router.push(`/documents/${cid}`);
      } catch (e) {
        console.log(e);
      } finally {
        this.showLoading({
          loading: false,
          description: " ",
        });
      }
    },
  },
};
</script>

<style>
.CodeMirror {
  height: 100%;
}
</style>
