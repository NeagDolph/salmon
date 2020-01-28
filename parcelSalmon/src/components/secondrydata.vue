<template>
  <div class="col-3 col-xl-3 col-lg-3">
    <div class="percentage z-depth-half">
      guess what
      <br>
      you're a failiure
    </div>
  </div>
</template>

<script>
export default {
  props: ["classes"],
  methods: {},
  computed: {
  }
};
</script>

<style lang="scss" scoped>
@import "../css/settings.scss";

.percentage {
  background: $main1;
  position: relative;
  border-radius: 8px;
  width: 100%;
  padding: 10px;
  font-family: 'Fanta';

  .ball {
    width: 11vw;
    height: 11vw;
    border-radius: 50%;
    font-family: Roboto;
    background: black;
    margin: auto;
    display: block;
    color: $red;
    text-align: center;
    line-height: 11vw;
    font-size: 3vw;
  }
  
  .yescampus {
    color: $green;
  }
}
</style>