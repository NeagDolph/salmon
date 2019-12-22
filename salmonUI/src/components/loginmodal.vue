<template>
  <div class="loginmodal row">
    <div class="col-3 col-sm-3 mx-auto d-block" :class="animateClasses" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog cascading-modal modal-avatar modal-sm">
        <!--Content-->
        <div class="modal-content z-depth-2">
          <!--Header-->
            <img
              src="https://lemontree.dev/logo.png"
              alt="logo"
              class="rounded-circle img-responsive z-depth-2 mx-auto"
            />
          <!--Body-->
          <div class="modal-body text-center mb-1">
            <div class="text-center mt-4">
              <loginButton :loggedin="loggedin" :signFuncs="signFuncs" />
            </div>
          </div>
        </div>
        <!--/.Content-->
      </div>
    </div>
  </div>
</template>

<script>
import loginButton from "./loginbutton";

export default {
  props: ["loggedin", "signFuncs"],
  components: { loginButton },
  computed: {
    animateClasses() {
      return this.$props.loggedin === false ? "animated fadeInUp fast" : "";
    }
  }
};
</script>

<style lang="scss">
.loginmodal {
  position: fixed;
  top: 0;
  left: 0;
  padding: 0;
  overflow: hidden;
  margin: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.16);
  display: flex;
  align-items: center;
  align-content: center;
  outline: 0;
  font-family: 'Fanta';

  .modal-content {
    padding-top: 30px;
    outline: 0;
  }

  >div {
    outline: 0;
  }

  .img-responsive {
    width: 100px;
    position: absolute;
    left: calc(50% - 50px);
    top: -50px;
  }
}
</style>