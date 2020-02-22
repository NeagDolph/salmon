<template>
    <div class="percent z-depth-half" ref="percent" v-bind:style="{ height: open ? '800px' : (setMid == '0px' ? false : (parseInt(setMid) * 2 + 15 + 'px')), transform: open == true ? `translateY(${-(adminTop - globalData.dataTop) + 'px'})` : 'translateY(0px)'}" @click="openMenu()">
      <div class="row" style="width: 100%; margin: 0;">
        <div class="buttonBar" v-bind:style="{ top: setMid }" v-if="!open"></div>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      buttonHeight: 0,
      open: false,
      setMid: "0px",
      adminTop: 0
    };
  },
  methods: {
    openMenu() {
      this.open = !this.open;
      this.setGlobal("adminOpen", this.open)
    }
  },
  props: ["classes", "globalData"],
  mounted() {
    this.$nextTick(function() {
      if (this.$refs.percent) {
        this.adminTop = this.$refs.percent.getBoundingClientRect().top
        this.setMid = ((window.innerHeight - this.$refs.percent.getBoundingClientRect().top) / 2 - (13 / 2 /* bar height */)) + "px"
        this.buttonHeight = this.$refs.percent.offsetHeight
      }
    })
  }
};
</script>

<style lang="scss" scoped>
@import "../css/settings.scss";

.percentRow {
  width: 100%;
  height: fit-content;
  position: relative;
  display: block;
}

.statusCont {
  width: 29%;
  user-select: none;
  .statusMarker {
    width: 3em;
    height: 3em;
    display: block;
    background: white;
    fill: $red;
    margin: 0 auto;
    border-radius: 3em;
    margin-top: calc(4vw - 38px);
    left: 0;
    transform: translateY(2em) scale(2);

    &.green {
      fill: $green;
    }
  }
}

.buttonBar {
  width: 80%;
  position: relative;
  display: block;
  height: 13px;
  border-radius: 20px;
  background: $background;
}

.percent {
  width: 100%;
  height: 158px;
  padding-bottom: 15px;
  bottom: 0;
  top: calc(57.8vh - 380px);
  transition: 0.5s ease;

  &.adminOpen {
    top: -50%;
  }

  .row {
    justify-content: center;
    display: flex;
  }


  background: $main1;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  position: relative;
}

</style>