<template>
  <div id="main">

    <!-- Header -->
    <Header :loggedin="loggedin" :signFuncs="sharedData.signFuncs"/>
    <Displaydata :classes="sharedData.classes" v-if="loggedin"/>

    <!-- Teacher panel -->
    <div id="teacher" v-if="sharedData.teacher && loggedin" :style="loggedin ? '' : 'filter: blur(4px)'">
      <div class="row">
        <div class="col-3 col-xl-5 midpanel">
          <teacherpanel :sharedData="sharedData"/>
        </div>
      </div>
    </div>

    <!-- Student panel -->
    <div id="student" v-if="!sharedData.teacher && loggedin" :style="loggedin ? '' : 'filter: blur(4px)'">
      <div class="row mainRow">
        <Displaydata :classes="sharedData.classes"/>
        <secondrydata :classes="sharedData.classes"/>
        <classes :classes="sharedData.classes" />
      </div>
    </div>


    <loginmodal v-if="loggedin === false" :loggedin="loggedin" :signFuncs="sharedData.signFuncs"/>
    <modaledit :userdata="editSelect" :tclasses="sharedData.tclasses" :editmodalopen="editState"/>
  </div>
</template>

<script>
import sidebar from "./components/sidebar.vue";
import Header from "./components/header.vue";
import Displaydata from "./components/data.vue";
import secondrydata from "./components/secondrydata.vue";
import classes from "./components/classes.vue";
import loginmodal from "./components/loginmodal.vue";
import teacherpanel from "./components/teacherpanel.vue";
import modaledit from "./components/modaledit.vue";
import './css/box-shadow.min.css';


export default {
  name: "app",
  props: ["loggedin", "sharedData", "editSelect", "editState", "mainClasses"],
  data() {
    return {
      // loggedin: true
      classes: []
    };
  },
  methods: {
  },
  mounted() {
    console.log("APP MOUNTED")
  },
  components: {
    sidebar,
    Displaydata,
    classes,
    loginmodal,
    teacherpanel,
    modaledit,
    secondrydata,
    Header
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
@import "./css/settings.scss";

.trackerTitle {
  font-family: mr-eaves-modern, sans-serif;
  font-weight: 300;
  font-style: normal;
  font-size: 60px;
}

#student {
  &>.row {
    padding: 2em 7em;
  }
}

#header {
  padding: 0 8em;
}

@media screen and (min-width: 1400px) {
  #student > .row {
    padding: 2em 12em;
  }

  #header {
    padding: 0 12em;
  }
}

@media screen and (min-width: 1630px) {
  #student > .row {
    padding: 2em 18em;
  }

  #header {
    padding: 0 18em;
  }
}

@media screen and (max-width: 1200px) {
  #student > .row {
    padding: 2em 4em;
  }

  #header {
    padding: 0 4em;
  }
}

#main {
  min-height: 100%;
  height: 100vh;
  margin: 0;
  background: $background;
  font-family: 'Fanta';
}

#main .row {
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

.tooltip {
  opacity: 1 !important;
  transition: opacity 0.5s;

  &:after {
    border: solid transparent;
    content: " ";
    width: 0px;
    border-color: transparent;
    height: 0px;
    border-top-color: black;
    border-width: 6px;
    margin-left: -6px;
    top: 100%;
    left: 50%;
    position: absolute;
  }
}
</style>
