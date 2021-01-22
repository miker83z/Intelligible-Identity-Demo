<template>
  <div class="container">
    <div class="signup-content" id="registration">
      <div class="signup-form">
        <h2 class="form-title">Login through your Intelligible Identity</h2>
        <div class="alert alert-danger" v-if="loginError">
          {{ loginError }}
        </div>
        <form
          @submit.prevent="onLogin()"
          class="register-form"
          id="register-form"
        >
          <div class="form-group form-button">
            <input
              type="submit"
              name="login"
              id="login"
              class="form-submit"
              value="Login"
            />
          </div>
        </form>
      </div>
      <div class="signin-image">
        <figure>
          <img src="../../assets/images/login-image.jpg" alt="login image" />
        </figure>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";

export default {
  data() {
    return {
      loginError: "",
    };
  },
  methods: {
    ...mapActions(["login"]),
    ...mapMutations({
      showLoading: "LOADING_SPINNER_SHOW_MUTATION",
    }),
    async onLogin() {
      //make spinner true
      this.showLoading({
        loading: true,
        description: "Contacting decentralized providers",
      });
      try {
        await this.login();
      } catch (e) {
        this.loginError = e;
      } finally {
        this.showLoading({
          loading: false,
          description: " ",
        });
      }

      this.$router.push("/certificates");
    },
  },
};
</script>
