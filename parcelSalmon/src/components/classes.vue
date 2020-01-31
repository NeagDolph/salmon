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
  }
};
</script>

<style lang="scss">
@import "../css/settings.scss";

.classescontcont {
  padding: 0 !important;
}

.classescont {
  width: 100%;
  min-height: 100%;
  height: calc(100vh - 2em);
  overflow-y: auto;
  padding-right: 15px;
  padding-left: 15px;
}

.redclass-item {
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
    font-size: 21px;
    color: white;
    width: 85px;
    position: absolute;
    bottom: 10px;
    background: $red;
    font-family: futura-pt, sans-serif; 
    font-weight: 400; 
    font-style: normal;
    line-height: 29px;
    padding-bottom: 0px;
    border-radius: 12px;
    display: block;
  }

  &:nth-child(1) {
  }
  
  
  &:nth-last-child(1) {
    margin-bottom: 25px;
  }

  &.greenclass {

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