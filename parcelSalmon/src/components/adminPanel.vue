<template>
    <div class="percent z-depth-half" ref="bottomPercent" >
      <div class="row" style="width: 100%; margin: 0;">
        <div class="col-12 px-0 mx-0">

        </div>
        <div class="col-12">
          
        </div>
        <div class="col-12 px-0 mx-0">
          
        </div>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      buttonHeight: 0,
    };
  },
  props: ["classes"],
  methods: {
  },
  computed: {
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

.percent {
  width: 100%;
  height: 158px;
  padding-bottom: 15px;
  bottom: 0;
  top: calc(60% - 380px);

  background: $main1;
  border-radius: 6px;
  display: flex;
  position: relative;
}
</style>