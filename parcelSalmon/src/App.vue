<template>
  <div id="main">

    <!-- Header -->
    <Header :loggedin="loggedin" :style="loggedin ? '' : 'filter: blur(6px)'" :userAuth="userAuth"/>

    <!-- Student panel -->
    <div id="student" class="pageContainer" v-if="!sharedData.teacher">

      <div class="row mainRow" :style="loggedin ? '' : 'filter: blur(8px)'">
        <div class="col-xl-6 col-lg-6 col-sm-6 col-xs-12 xs-mb">
          <displayData :sharedData="sharedData" :globalData="globalData" :isMobile="isMobile"/>
          <adminPanel v-if="sharedData.admin && !isMobile" :globalData="globalData" :sharedData="sharedData"/>
        </div>
        <secondrydata :sharedData="sharedData" class="xs-mb"/>
        <classes :sharedData="sharedData" :loggedin="loggedin"/>
      </div>

    </div>

    <!-- Teacher -->
    <div id="teacher" class="pageContainer" v-if="sharedData.teacher">
      <div class="row mainRow">
        <teacherpanel :sharedData="sharedData"/>
      </div>
    </div>


    <loginmodal v-if="loggedin === false" :loggedin="loggedin"/>
    <modaledit :userdata="editSelect" :tclasses="sharedData.tclasses" :editmodalopen="editState"/>
  </div>
</template>

<script>
import Header from "./components/header.vue";
import displayData from "./components/data.vue";
import adminPanel from "./components/adminPanel.vue";
import secondrydata from "./components/secondrydata.vue";
import classes from "./components/classes.vue";
import loginmodal from "./components/loginmodal.vue";
import teacherpanel from "./components/teacherpanel.vue";
import modaledit from "./components/modaledit.vue";
import './css/box-shadow.min.css';


export default {
  name: "app",
  props: ["loggedin", "sharedData", "editSelect", "editState", "userAuth", "signIn", "signOut", "globalData"],
  data() {
    return {
      // loggedin: true
      classes: [],
      isMobile: false,
    };
  },
  methods: {
    onResize () {
      this.isMobile = window.innerWidth < 575
    }
  },
  components: {
    displayData,
    adminPanel,
    classes,
    loginmodal,
    teacherpanel,
    modaledit,
    secondrydata,
    Header
  },
  beforeDestroy () {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true })
    }
  },
  mounted() {
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
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

* {
    -webkit-overflow-scrolling: touch;
}

.trackerTitle {
  font-family: mr-eaves-modern, sans-serif;
  font-weight: 300;
  font-style: normal;
  font-size: 60px;
}

.pageContainer {
  &>.row {
    padding: 2em 7em;
  }
}

#header {
  padding: 0 8em;
}

@media screen and (min-width: 1400px) {
  .pageContainer > .row {
    padding: 2em 12em;
  }

  #header {
    padding: 0 12em;
  }
}

@media screen and (min-width: 1630px) {
  .pageContainer > .row {
    padding: 2em 18em;
  }

  #header {
    padding: 0 18em;
  }
}

@media screen and (max-width: 1200px) {
  .pageContainer > .row {
    padding: 2em 4em;
  }

  #header {
    padding: 0 4em;
  }
}

@media screen and (max-width: 768px) {
  
  .pageContainer > .row {
    padding: 2em 0.2em;
  }

  #header {
    padding: 0 4em;
  }

  body, html {
    overflow-y: auto !important;
  }

  .xs-mb {
    margin-bottom: 20px;
  }

  .row {
    margin-right: 0 !important;
    margin-left: 0 !important;
  }
}

#main {
  height: auto;
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
