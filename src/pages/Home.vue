<template>
  <div class="container">
    <div class="signin-content">
      <div class="signin-image">
        <figure>
          <img src="../assets/images/signin-image.jpg" alt="sing up image" />
        </figure>
      </div>
      <div class="signin-form">
        <h2 class="form-title">Intelligible Identity and Certificates</h2>
        <div class="form-group form-button">
          <router-link to="/signup"
            ><button class="btn btn-primary">
              Register a new Identity
            </button></router-link
          >
          <br />
          <br />
          <router-link to="/login"
            ><button class="btn btn-danger">
              Login with your Identity
            </button></router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>