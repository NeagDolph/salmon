<template>
  <div id="headerCont">
    <div class="row">
      <div class="col-12">
        <div id="header" class="z-depth-1">
          <loginButton :loggedin="loggedin" class="loginButton"/>
          <div class="nightMode"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loginButton from "./loginbutton.vue";

export default {
  props: ["loggedin"],
  components: {
    
    loginButton
  }
};
</script>

<style lang="scss" scoped>
@import "../css/settings.scss";

#headerCont {
  .row {
    .col-12 {
      padding: 0;
    }
  }
}

#header {
  background: $accent1;
  height: 90px;
  margin: 35px 0 10px;

  .nightMode {
    width: 50px;
    height: 50px;
    border-radius: 80px;
    background: $background;
    float: right;
    margin: auto 0;
    display: block;
    top: 50%;
    transform: translateY(-50%);
    position: relative;
  }

  .loginButton {
    float: left;
    top: 50%;
    position: relative;
    transform: translateY(-50%);
  }
}
</style>