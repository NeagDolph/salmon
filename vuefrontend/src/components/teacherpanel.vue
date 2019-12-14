<template>
  <div id="teacher" class="row">
    <popper trigger="hover" :options="{placement: 'right-start'}" v-for="user in users" v-bind:key="user.userid" class="useritemspan mb-4 col-10 mx-auto z-depth-1">
      <div class="popper z-depth-2">
        <div
          v-for="(status, idx) in user.classes.split('')"
          :key="idx"
          class="popperBlock"
          :class="{red: status === '0', green: status === '1'}"
        >
          {{shortnames[idx]}}
        </div>
      </div>

      <div class="reference" slot="reference">
        <div class="useritem">
          <div class="name">{{user.name}}</div>
          <button
            type="button"
            class="btn btn-primary"
            @click="mod(user)"
          >Edit</button>
        </div>
      </div>
    </popper>
  </div>
</template>

<script>
import Popper from "vue-popperjs";
import "vue-popperjs/dist/vue-popper.css";
import {shortnames} from "./../globals.js"

export default {
  data() {
    return {
      shortnames: shortnames
    }
  },
  components: {
    popper: Popper
  },
  props: ["users"],
  methods: {
    mod(user) {
      this.usereditmodal(user)
    }
  }
};
</script>

<style lang="scss" scoped>
$red: #ff6961;
$green: #5cce89;

#teacher {
  height: auto;
  margin: 15px 0;
}

.useritemspan {
  padding: 0;
}

.useritem {
  height: fit-content;
  border-radius: 5px;
  padding: 6px;
  background: white;
}

.popper {
  width: 168px;


  .popperBlock {
    width: 45px;
    height: 45px;
    border-radius: 6px;
    margin: 4px;
    cursor: pointer;
    float: left;
    text-align: center;
    line-height: 45px;
    &.green {
      background: $green;
      color: black;
    }

    &.red {
      background: $red;
      color: white;
    }
  }
}
</style>