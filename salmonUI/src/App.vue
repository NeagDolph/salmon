<template>
  <div id="app">
    <div class="row" :style="loggedin ? '' : 'filter: blur(4px)'">
      <sidebar :loggedin="loggedin" :signFuncs="sharedData.signFuncs"/>
      <div class="col-3 col-xl-5 midpanel">
        <teacherpanel v-if="sharedData.teacher" :users="sharedData.users" :tclasses="sharedData.tclasses" :shortnames="sharedData.shortnames"/>
      </div>
      <displaydata v-if="loggedin" :classes="sharedData.classes"/>
      <classes v-if="loggedin" :classes="sharedData.classes" />
    </div>
    <loginmodal v-if="loggedin === false" :loggedin="loggedin" :signFuncs="sharedData.signFuncs"/>
    <modaledit id="modal-useredit" :userdata="editSelect" :classes="sharedData.classes" :users="sharedData.users" :tclasses="sharedData.tclasses"/>
  </div>
  <!-- <div id="ruler"></div> -->
</template>

<script>
import sidebar from "./components/sidebar";
import displaydata from "./components/data";
import classes from "./components/classes";
import loginmodal from "./components/loginmodal";
import teacherpanel from "./components/teacherpanel";
import modaledit from "./components/modaledit";
import './css/box-shadow.min.css';

export default {
  name: "app",
  props: ["loggedin", "sharedData", "editSelect"],
  data() {
    return {
      // loggedin: true
    };
  },
  methods: {
  },
  components: {
    sidebar,
    displaydata,
    classes,
    loginmodal,
    teacherpanel,
    modaledit
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500");
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
@font-face {
  font-family: "Fanta";
  src: url("https://atischool.net/static/font.ttf") format('truetype');
}
@import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
@import url("https://use.typekit.net/qwh8nvj.css");

//ipp
$background: #eeeeee;
$main1: #364f6b;

$sub: #d8f4f7;

$text1: #393e46;
$text2: #fc5185;

$google-button: #4285f4;

$red: #ff6961;
$green: #5cce89;

#app {
  min-height: 100%;
  height: 100vh;
  margin: 0;
  background: $background;
  font-family: 'Fanta';
}

#app .row {
  height: 100%;
}

body {
  overflow: hidden;
  min-height: 100%;
  height: 100%;
}

html {
  overflow: hidden;
  min-height: 100%;
  height: 100%;
}

#ruler {
  visibility: hidden;
  white-space: nowrap;
  font-size: 25px;
  position: absolute;
  font-family: 'Fanta';
}

.controw {
  height: 100%;
}

.toast {
  background-color: #51a351 !important;
  font-family: 'Fanta';
}

.vertical-center {
  display: flex;
  align-items: center;
}
</style>
