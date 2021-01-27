<template>
  <div class="container">
    <div class="signup-content" id="submitCert">
      <div class="signup-form">
        <h2 class="form-title">Submit your Intelligible Certificate</h2>
        <div class="alert alert-danger" v-if="submissionError">
          {{ submissionError }}
        </div>
        <form
          @submit.prevent="onSubmission()"
          class="register-form"
          id="register-form"
        >
          <div class="form-group">
            <label for="name"><i class="zmdi zmdi-file-text"></i></label>
            <input
              type="text"
              id="name"
              placeholder="Certified document name"
              v-model.trim="name"
            />
            <div class="error" style="color: red" v-if="validatErrs.name">
              {{ validatErrs.name }}
            </div>
            <div v-if="!validatErrs.name"><br /></div>
          </div>
          <div class="form-group">
            <label for="uri"><i class="zmdi zmdi-link"></i></label>
            <input
              type="text"
              id="uri"
              placeholder="Certified document URI"
              v-model.trim="uri"
            />
            <div class="error" style="color: red" v-if="validatErrs.uri">
              {{ validatErrs.uri }}
            </div>
            <div v-if="!validatErrs.uri"><br /></div>
          </div>
          <div class="form-group">
            <label for="documentDigest"><i class="zmdi zmdi-lock"></i></label>
            <input
              type="text"
              id="documentDigest"
              placeholder="Certified document hash digest"
              v-model.trim="documentDigest"
            />
            <div
              class="error"
              style="color: red"
              v-if="validatErrs.documentDigest"
            >
              {{ validatErrs.documentDigest }}
            </div>
            <div v-if="!validatErrs.documentDigest"><br /></div>
          </div>
          <div class="form-group">
            <label for="addressWeb3"><i class="zmdi zmdi-account"></i></label>
            <input
              type="text"
              id="addressWeb3"
              placeholder="Ethereum address of the receiver"
              v-model.trim="addressWeb3"
            />
            <div
              class="error"
              style="color: red"
              v-if="validatErrs.addressWeb3"
            >
              {{ validatErrs.addressWeb3 }}
            </div>
            <div v-if="!validatErrs.addressWeb3"><br /></div>
          </div>
          <div class="form-group form-button">
            <input
              type="submit"
              name="signup"
              id="signup"
              class="form-submit"
              value="Submit"
            />
          </div>
        </form>
      </div>
      <div class="signup-image">
        <figure>
          <img src="../assets/images/signin-image.jpg" alt="singup image" />
        </figure>
      </div>
    </div>
  </div>
</template>

<script>
import CertificateValidations from "../services/CerticateValidations";
import { mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {
      name: "",
      uri: "",
      documentDigest: "",
      addressWeb3: "",
      validatErrs: [],
      submissionError: "",
    };
  } /*
    beforeRouteLeave() {
        console.log('rote leaving');
        console.log(this.$store);
    },
    beforeRouteEnter(_, _1, next) {
        next((vm) => {
            console.log('route entering');
            console.log(vm.$store.state);
        });
    },*/,
  methods: {
    ...mapActions(["submitCertificate"]),
    ...mapMutations({
      showLoading: "LOADING_SPINNER_SHOW_MUTATION",
    }),
    async onSubmission() {
      let validations = new CertificateValidations(
        this.name,
        this.uri,
        this.documentDigest,
        this.addressWeb3
      );

      this.validatErrs = validations.checkValidations();
      if (
        "name" in this.validatErrs ||
        "uri" in this.validatErrs ||
        "documentDigest" in this.validatErrs ||
        "addressWeb3" in this.validatErrs
      ) {
        return false;
      }

      //make spinner true
      this.showLoading({
        loading: true,
        description: "Contacting decentralized providers",
      });
      //registration
      try {
        await this.submitCertificate({
          name: this.name,
          uri: this.uri,
          documentDigest: this.documentDigest,
          addressWeb3: this.addressWeb3,
        });
        this.$router.push("/documents");
      } catch (error) {
        this.submissionError = error;
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
