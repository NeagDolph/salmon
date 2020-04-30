<template>
  <button @click="toggleSign()" id="customBtn">
    {{loggedin ? "Logout" : "Login"}}
  </button>
</template>

<script>
import { signFuncs, authFunc2 } from '../js/auth.js';


export default {
  props: ["loggedin"],
  methods: {
    toggleSign() {
      if (!signFuncs.auth2) {
        return false
      }
      if (!this.loggedin) signFuncs.auth2.signIn().then(() => authFunc2());
      else {
        console.log("clicked")
        signFuncs.signOut();
      }
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