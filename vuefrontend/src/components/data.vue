<template>
  <div>
    <div class="row">
      <div class="col-12 chart z-depth-1">
        <div
          class="hascampus"
          :class="{yescampus: redpercent() == 0, nocampus: redpercent() !== 0}"
        >{{redpercent() == 0 ? "You have offcampus" : "You don't have offcampus"}}</div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 percentage z-depth-1">
        <div class="balltop">Red in</div>
        <div class="ball">{{redpercent()}}%</div>
        <div class="ballbottom">Of classes</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    redpercent() {
      return 40
    }
  }
};
</script>

<style>
</style>