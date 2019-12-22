<template>
  <div class="sidebar col-3 col-sm-2 z-depth-1-half">
    <loginButton :loggedin="loggedin" :signFuncs="signFuncs"/>
  </div>
</template>

<script>
import loginButton from "./loginbutton";

export default {
  props: ["loggedin", "signFuncs"],
  components: {loginButton},
};
</script>

<style lang="scss" scoped>
$main1: #364f6b;


.sidebar {
  height: 100%;
  background: $main1;

    #customBtn {
      position: relative;
      left: calc(50% - 39px);
    }

    .row {
      height: 160px;
      margin: 0 !important;
    }
}

</style>