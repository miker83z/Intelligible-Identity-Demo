<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h2>Document Details</h2>
        <div
          v-if="
            documentObj !== undefined && documentObj.information !== undefined
          "
        >
          <table id="firstTable" class="table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in Object.keys(documentObj.information)"
                v-bind:key="row"
              >
                <td>{{ row }}</td>
                <td>
                  {{
                    typeof documentObj.information[row] !== "object"
                      ? documentObj.information[row]
                      : displayObjectInTable(documentObj.information[row])
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          v-if="
            documentObj !== undefined && documentObj.references !== undefined
          "
        >
          <table id="firstTable" class="table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in Object.keys(documentObj.references)"
                v-bind:key="row"
              >
                <td>{{ row }}</td>
                <td>
                  {{
                    typeof documentObj.references[row] !== "object"
                      ? documentObj.references[row]
                      : displayObjectInTable(documentObj.references[row])
                  }}
                </td>
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
      this.document = await this.retrieveIPFS({ cid: this.cid });
      if (this.document.includes("intelligibleCertificate")) {
        this.documentObj = new IntelligibleCertificate();
        this.documentObj.fromStringMeta(this.document);
        if (this.isAuthenticated && this.getIntelligibleIdentity) {
          const tokenId = this.documentObj.meta.metaAndMain.metaDoc.doc.mainBody.tblock.find(
            (t) => t["@eId"] == "tblock_2"
          ).p.tokenId;
          const { provider, mainAddress } = this.getIntelligibleIdentity.web3;
          await this.documentObj.fromWeb3TokenId(
            provider,
            mainAddress,
            tokenId
          );
          this.receiverWeb3Adress = this.documentObj.web3.address;
        }
      } else if (this.document.includes("intelligibleIdentity")) {
        this.documentObj = new IntelligibleIdentity();
        this.documentObj.fromStringMeta(this.document);
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
    displayObjectInTable(obj) {
      var str = "";
      Object.keys(obj).forEach((k) => {
        if (
          k !== "@eId" &&
          k !== "FRBRuri" &&
          k !== "FRBRdate" &&
          k !== "FRBRcountry" &&
          k !== "@as" &&
          k !== "FRBRlanguage" &&
          k !== "type" &&
          k !== "@showAs"
        ) {
          str = str.concat(
            k,
            ": ",
            typeof obj[k] !== "object"
              ? obj[k]
              : this.displayObjectInTable(obj[k]),
            "; "
          );
        }
      });
      return str;
    },
  },
};
</script>

<style>
.CodeMirror {
  height: 100%;
}
</style>
