<template>
  <div class="col-3 col-lg-3 col-xl-2">
    <div data-simplebar data-simplebar-auto-hide="false" class="card z-depth-1">
      <div class="col-11 mx-auto">
        <div
          v-for="classItem in sorted"
          v-bind:key="classItem.name"
          :class="{greenclass: classItem.status}"
          class="redclass-item mx-auto"
        >
          <div class="title" :style="titleSize(classItem.name)">{{classItem.name}}</div>
          <span class="subtext">{{classItem.status ? "Completed" : "Missing"}}</span>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import simplebar from "simplebar-vue";
import "simplebar/dist/simplebar.min.css";

export default {
  props: ["classes"],
  methods: {
    titleSize() {
      return "font-size: 30px;";
    }
  },
  computed: {
    sorted() {
      return this.classes.sort((a, b) => {
        return a.status - b.status;
      });
    }
  },
  components: {
    simplebar
  }
};
</script>

<style lang="scss">
$red: #ff6961;
$green: #5cce89;
$sub: #d8f4f7;
$main1: #364f6b;

.simplebar-track {
  height: calc(100vh - 75px) !important;
  top: 20px !important;
  right: 5px !important;
}

.simplebar-scrollbar {
  right: 4px !important;
  &:before {
    background: #3c3351 !important;
    opacity: 1 !important;
  }
}

[data-simplebar] {
  .simplebar-wrapper {
    height: 100vh;
  }

  height: calc(100vh - 30px);
  margin-top: 15px;
  margin-right: 20px;

  .simplebar-content > div {
    padding: 0;
    overflow-x: hidden;
    padding-right: 10px;
  }
}

.redclass-item {
  background: $sub;
  border-radius: 10px;
  margin-bottom: 27px;
  padding-left: 10px;
  border: 3px #f58e88 dashed;
  width: 93%;
  height: 90px;
  background: #f7b1b1;

  .title {
    font-size: 30px;
    color: $main1;
    white-space: nowrap;
    width: 80%;
    line-height: 20px;
    font-family: Roboto, sans-serif;
    font-weight: 400;
    font-style: normal;
    margin-top: 14px;
    display: block;
  }

  .subtext {
    text-align: left;
    font-size: 18px;
    color: white;
    width: 79px;
    text-indent: 9px;
    background: $red;
    font-family: Roboto, sans-serif;
    font-weight: 400;
    font-style: normal;
    line-height: 25px;
    padding-bottom: 0px;
    border-radius: 12px;
    margin: 16px 0 9px;
    display: block;
  }

  &:nth-child(1) {
    margin-top: 20px;
  }

  &:nth-last-child(1) {
    margin-bottom: 25px;
  }

  &.greenclass {
    .title {
      padding-top: 15px;
    }

    .subtext {
      width: 104px;
      background: $green;
      color: white;
      text-indent: 7px;
    }

    background: #c2ffd7;
    border: 0;
  }
}
</style>