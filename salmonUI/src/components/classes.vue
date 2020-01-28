<template>
  <div class="col-3 col-lg-3 col-xl-3 classescontcont">
    <div class="classescont">
      <div
        v-for="classItem in sorted"
        v-bind:key="classItem.name"
        :class="{greenclass: classItem.status}"
        class="redclass-item mx-auto z-depth-half"
      >
        <div class="title" :style="titleSize(classItem.name)">{{classItem.name}}</div>
        <span class="subtext">{{classItem.status ? "Completed" : "Missing"}}</span>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  props: ["classes"],
  methods: {
    titleSize() {
      return "font-size: 50px;";
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
  height: 100px;
  padding: 10px;
  position: relative;
  background: $main1;
  margin-bottom: 30px;

  .title {
    font-size: 70px;
    color: $red;
    white-space: nowrap;
    width: 80%;
    line-height: 40px;
    display: block;
    
    font-family: mr-eaves-modern, sans-serif;
    font-weight: 200;
    font-style: normal;


  }

  .subtext {
    text-align: center;
    font-size: 18px;
    color: white;
    width: 85px;
    position: absolute;
    bottom: 10px;
    background: $red;
    font-family: Roboto, sans-serif;
    font-weight: 400;
    font-style: normal;
    line-height: 29px;
    padding-bottom: 0px;
    border-radius: 12px;
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