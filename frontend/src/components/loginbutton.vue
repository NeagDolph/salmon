<template>
  <button @click="toggleSign()" id="customBtn">
    {{loggedin ? "Logout" : "Login"}}
  </button>
</template>

<script>
import { authFunc2 } from '../js/auth.js';


export default {
  methods: {
    toggleSign() {
      if (!this.$store.state.auth2) {
        return false
      }
      if (!this.loggedin) this.$store.state.auth2.signIn();
      else {
        console.log("clicked")
        this.signOut();
      }
    }
  },
  computed: {
    loggedin() {
      return this.$store.state.loggedin;
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