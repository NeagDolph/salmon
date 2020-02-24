<template>
    <div class="percent z-depth-half" ref="mainPercent" :class="{adminOpen: glob}">
      <div class="row" style="width: 100%; margin: 0;">
        <div class="col-12 px-0 mx-0">
          <div class="statusCont">
            <img class="statusMarker" src="https://atischool.net/static/x.svg" v-if="percent < 100"/>
            <img class="statusMarker" src="https://atischool.net/static/check.svg" v-if="percent >= 100"/>
          </div>
        </div>
        <div class="col-12">
          <div id="pieCont" :class="{orangePointer: percent <= 37.5}">
            <div class="pie" id="pie1"></div>
            <div
              class="pie"
              id="pie2"
              :class="{full: percent == 100}"
              :style="{backgroundImage: `conic-gradient(#32326b ${percent - 0.01}%, transparent 0.01%, transparent ${100 - percent}%)`}"
            >
              <img class="smile" src="https://atischool.net/static/smile.svg" v-if="percent == 100"/>
            </div>
          </div>
        </div>
        <div class="col-12 px-0 mx-0">
          <div class="pieDataCont">
            <div class="pieData">
              {{percent}}%
              <br />
              <span class="subpercent" v-if="percent < 100">
                {{100 - percent}}%
                <div class="offTarget">off target</div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  props: ["classes", "globalData"],
  computed: {
    glob() {
      return this.globalData.adminOpen
    },
    percent() {
      return parseInt(
        (
          (this.classes.reduce((tot, el) => {
            return tot + el.status;
          }, 0) /
            this.classes.length) *
          100
        ).toFixed(1)
      );
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.setGlobal("dataTop", this.$refs.mainPercent.getBoundingClientRect().top)
    })
  }
};
</script>

<style lang="scss" scoped>
@import "../css/settings.scss";

@media screen and (max-width: 1100px) {
  #pieCont {
    width: calc(20em - 6vw) !important;
    height: calc(20em - 6vw) !important;
  }
}

@media screen and (min-width: 1200px) {
  .statusMarker {
    width: calc(2em + 1.5vw) !important;
    height: calc(2em + 1.5vw) !important;
    margin-top: calc(2.5vw - 20px) !important;
  }
}

@media screen and (max-width: 1000px) {
  .subpercent {
    display: none;
  }

  .pieData {
    font-size: 80px;
  }
}

.adminOpen {
  opacity: 0;
}

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

.pie {
  width: 100%;
  height: 100%;
  position: absolute;
  transition: backgroundImage 400ms;
  border-radius: 9999px;
  filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.3));

  &#pie1 {
    width: 97%;
    height: 97%;
    background: $accent1;
  }

  &#pie2 {
    display: flex;
    align-content: center;
    justify-content: center;

    .smile {
      display: block;
      position: relative;
      width: 200px;
      transform: rotateY(18deg);
      fill: $main;
    }
  }
}

.pieDataCont {
  width: calc(100px + 12%);
  display: flex;
  height: auto;
  float: right;
  justify-content: center;
  position: relative;
  .pieData {
    width: fit-content;
    line-height: 20px;
    margin: 0 auto;
    user-select: none;
    height: 60px;
    font-size: 60px;
    font-weight: 100;
    bottom: -10px;
    color: $accent2;
    float: right;
    display: block;
    font-family: futura-pt, sans-serif; 
    font-weight: 300; 
    font-style: normal;
    position: relative;

    .subpercent {
      color: rgb(104, 104, 104);
      font-family: futura-pt, sans-serif; 
      font-weight: 400;
      font-style: normal;
      font-size: 24px;

      .offTarget {
        font-family: mr-eaves-modern, sans-serif;
        font-weight: 300;
        font-style: italic;
        font-size: 27px;

        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap; 

        height: 0.7em;

        display: inline-block;
      }
    }
  }
}

@media screen and (max-width: 1120px) {
  #pieCont::after {
    opacity: 0;
  }
}



#pieCont {
  width: 20em;
  height: 20em;
  display: block;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 15px;
  margin: 0 auto;

  &.orangePointer {
    &::after {
      background: $accent1;
      bottom: 16px;
      right: 44px;
    }
  }

  &::after {
    content: "";
    z-index: 0;
    width: 12px;
    height: 28px;
    background: $accent2;
    display: block;
    position: absolute;
    transition: 400ms;
    bottom: 14px;
    right: 42px;
    transform: rotate(-42deg);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
}

.percent {
  width: 100%;
  height: auto;
  transition: 0.5s;
  padding-bottom: 15px;
  background: $main1;
  border-radius: $curve;
  display: flex;
  position: relative;
}
</style>