<template>
  <div class="col-4 col-xl-3">
    <div class="row">
      <div class="col-12 chart z-depth-1">
        <div
          :class="{yescampus: redpercent == 100, nocampus: redpercent !== 0}"
        >{{redpercent == 0 ? "You have offcampus" : "You don't have offcampus"}}</div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 percentage z-depth-1">
        <div class="balltext balltop">Red in</div>
        <div class="ball">{{redpercent}}%</div>
        <div class="balltext">Of classes</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["classes"],
  methods: {},
  computed: {
    redpercent() {
      //number of reds upon total x 100
      console.log("REDPER", this.$props.classes)
      return (
        (
          this.$props.classes.classes.reduce((tot, el) => {return tot + !el.status}, 0)
          / this.$props.classes.classes.length
        ) * 100
      ).toFixed(1);
    }
  }
};
</script>

<style lang="scss" scoped>
$red: #ff6961;
$green: #5cce89;
$sub: #d8f4f7;
$main1: #364f6b;

.chart {
  height: 42vh;
  background: $main1;
  border-bottom-left-radius: 2000px;
  border-bottom-right-radius: 2000px;

  div {
    text-align: center;
    font-size: 36px;
    margin-top: 100px;
  }

  .yescampus {
    color: $green;
  }

  .nocampus {
    color: $red;
  }
}

.percentage {
  height: 48vh;
  background: $main1;
  bottom: 0;
  position: absolute !important;
  border-top-left-radius: 2000px;
  border-top-right-radius: 2000px;

  .balltext {
    text-align: center;
    margin-top: 10px;
    font-size: 36px;
    color: white;
  }

  .balltop {
    margin: 60px 0 10px;
  }

  .ball {
    width: 11vw;
    height: 11vw;
    border-radius: 50%;
    background: $sub;
    margin: auto;
    display: block;
    color: $red;
    text-align: center;
    line-height: 11vw;
    font-size: 3vw;
    font-weight: bold;
  }
}
</style>