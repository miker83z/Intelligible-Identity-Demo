<template>
  <div class="container">
    <div class="signup-content" id="registration">
      <div class="signup-form">
        <h2 class="form-title">Create your Intelligible Identity</h2>
        <div class="alert alert-danger" v-if="registrationError">
          {{ registrationError }}
        </div>
        <form
          @submit.prevent="onSignup()"
          class="register-form"
          id="register-form"
        >
          <div class="form-group">
            <label for="name"
              ><i class="zmdi zmdi-account material-icons-name"></i
            ></label>
            <input
              type="text"
              id="name"
              placeholder="Your Name"
              v-model.trim="name"
            />
            <div class="error" style="color: red" v-if="validatErrs.name">
              {{ validatErrs.name }}
            </div>
            <div v-if="!validatErrs.name"><br /></div>
          </div>
          <div class="form-group">
            <label for="email"><i class="zmdi zmdi-email"></i></label>
            <input
              type="email"
              id="email"
              placeholder="Your Email"
              v-model.trim="email"
            />
            <div class="error" style="color: red" v-if="validatErrs.email">
              {{ validatErrs.email }}
            </div>
            <div v-if="!validatErrs.email"><br /></div>
          </div>
          <div class="form-group">
            <label for="pass"><i class="zmdi zmdi-lock"></i></label>
            <input
              type="password"
              id="pass"
              placeholder="Password"
              v-model.trim="password"
            />
            <div class="error" style="color: red" v-if="validatErrs.password">
              {{ validatErrs.password }}
            </div>
            <div v-if="!validatErrs.password"><br /></div>
          </div>
          <div class="form-group">
            <label for="repass"><i class="zmdi zmdi-lock-outline"></i></label>
            <input
              type="password"
              id="repass"
              placeholder="Repeat your password"
              v-model.trim="rePassword"
            />
            <div class="error" style="color: red" v-if="validatErrs.rePassword">
              {{ validatErrs.rePassword }}
            </div>
            <div v-if="!validatErrs.rePassword"><br /></div>
          </div>
          <div class="form-group form-button">
            <input
              type="submit"
              name="signup"
              id="signup"
              class="form-submit"
              value="Register"
            />
          </div>
        </form>
      </div>
      <div class="signup-image">
        <figure>
          <img src="../../assets/images/signup-image.jpg" alt="singup image" />
        </figure>
      </div>
    </div>
  </div>
</template>

<script>
import SignupValidations from "../../services/SignupValidations";
import { mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      validatErrs: [],
      registrationError: "",
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
    ...mapActions(["signup"]),
    ...mapMutations({
      showLoading: "LOADING_SPINNER_SHOW_MUTATION",
    }),
    async onSignup() {
      let validations = new SignupValidations(
        this.name,
        this.email,
        this.password,
        this.rePassword
      );

      this.validatErrs = validations.checkValidations();
      if (
        "name" in this.validatErrs ||
        "email" in this.validatErrs ||
        "password" in this.validatErrs ||
        "rePassword" in this.validatErrs
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
        await this.signup({
          name: this.name,
          email: this.email,
          password: this.password,
        });
        this.$router.push("/documents");
      } catch (error) {
        this.registrationError = error;
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
