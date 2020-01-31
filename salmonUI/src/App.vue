<template>
  <div id="app">

    <!-- Header -->
    <Header :loggedin="loggedin" :signFuncs="sharedData.signFuncs" v-if="loggedin"/>

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
        <displaydata :classes="sharedData.classes"/>
        <secondrydata :classes="sharedData.classes"/>
        <classes :classes="sharedData.classes" />
      </div>
      <displaydata v-if="loggedin" :classes="sharedData.classes"/>
      <classes v-if="loggedin" :classes="sharedData.classes" />
    </div>
    <loginmodal v-if="loggedin === false" :loggedin="loggedin" :signFuncs="sharedData.signFuncs"/>
    <modaledit :userdata="editSelect" :tclasses="sharedData.tclasses" :editmodalopen="editState"/>
  </div>
  <!-- <div id="ruler"></div> -->
</template>

<script>
import sidebar from "./components/sidebar.vue";
import displaydata from "./components/data.vue";
import classes from "./components/classes.vue";
import loginmodal from "./components/loginmodal.vue";
import teacherpanel from "./components/teacherpanel.vue";
import modaledit from "./components/modaledit.vue";
import './css/box-shadow.min.css';


export default {
  name: "app",
  props: ["loggedin", "sharedData", "editSelect", "editState"],
  data() {
    return {
      // loggedin: true
    };
  },
  methods: {
  },
  mounted() {
    console.log("APP MOU")
    console.log("PEEPU")
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


.italicEaves {
  font-family: mr-eaves-modern, sans-serif;
  font-weight: 300;
  font-style: italic;
}

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

#student {
  &>.row {
    padding: 2em 7em;
  }
}

#student {
  &>.row {
    padding: 2em 7em;
  }
}

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
