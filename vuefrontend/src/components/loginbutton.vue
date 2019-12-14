<template>
  <button @click="toggleSign()" id="customBtn">
    {{loggedin ? "Logout" : "Login"}}
  </button>
</template>

<script>
export default {
  props: ["loggedin", "signFuncs"],
  methods: {
    toggleSign() {
      if (!this.$props.loggedin) this.$props.signFuncs.signIn();
      else this.$props.signFuncs.signOut();
    }
  }
};
</script>

<style lang="scss">
$google-button: #4285f4;

#customBtn {
  height: 46px;
  left: -10px;
  padding-left: 20px !important;
  padding-right: 20px !important;
  border-radius: 30px !important;
  color: #fff !important;
  background-color: $google-button;
  outline: 0;
  border: 0;
}
</style>