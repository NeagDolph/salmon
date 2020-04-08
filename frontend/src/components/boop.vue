<template>
  <div>
    <Header :loggedin="loggedin" :signFuncs="sharedData.signFuncs" v-if="loggedin" />

    <!-- Teacher panel -->
    <div
      id="teacher"
      v-if="sharedData.teacher && loggedin"
      :style="loggedin ? '' : 'filter: blur(4px)'"
    >
      <div class="row">
        <div class="col-3 col-xl-5 midpanel">
          <teacherpanel :sharedData="sharedData" />
        </div>
      </div>
    </div>

    <!-- Student panel -->
    <div id="student" :style="loggedin ? '' : 'filter: blur(4px)'">
      <div class="row mainRow">
        <displaydata :classes="sharedData.classes" />
        <secondrydata :classes="sharedData.classes" />
        <classes :classes="sharedData.classes" />
      </div>
    </div>

    <loginmodal v-if="!loggedin" :loggedin="loggedin" :signFuncs="sharedData.signFuncs" />
    <modaledit :userdata="editSelect" :tclasses="sharedData.tclasses" :editmodalopen="editState" />
  </div>
</template>

<script>
import displaydata from "./data.vue";
import secondrydata from "./secondrydata.vue";
import classes from "./classes.vue";
import loginmodal from "./loginmodal.vue";
import teacherpanel from "./teacherpanel.vue";
import modaledit from "./modaledit.vue";

export default {
  props: ["loggedin", "sharedData", "editSelect", "editState", "mainClasses"],
  components: {
    displaydata,
    classes,
    loginmodal,
    teacherpanel,
    modaledit,
    secondrydata
  }
};
</script>

<style>
</style>