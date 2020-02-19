<template>
  <div class="col-3 col-xl-3 col-lg-3">
    <div class="percentage z-depth-half">
      <div class="targetHeader"><p :class="{green: redclasses <= 0, red: redclasses >= 1}">{{redclasses}}</p> off target courses</div>
      <div class="targetBody">
        <p v-for="className in redclassArray" :key="className">{{className}}</p>
      </div>
      
    </div>
  </div>
</template>

<script>
export default {
  props: ["classes"],
  methods: {},
  computed: {
    redclassArray() {
      return this.classes.map(e => {if (!e.status) return e.name; else return 7}).filter(e => {if (e == 7) return false; else return true})
    },
    redclasses() {
      return this.classes.reduce((tot, el) => {
        return tot + (!el.status ? 1 : 0);
      }, 0)
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
  font-size: 26px;
  font-family: mr-eaves-modern, sans-serif;
  font-weight: 300;
  font-style: italic;
  color: #4F6283;
  line-height:30px;

  .targetBody {
    line-height: 34px;
    font-size: 30px;
    color: $accent2;

    p {
      margin-bottom: 0;
    }
  }

  .targetHeader {
    display: flex;
    position: relative;
    width: auto;
    padding-bottom: 5px;
    padding-top: 7px;
    border-bottom: $accent2 dashed 1px;
    margin-bottom: 6px;

    height: 50px;

    p {
      border-radius: 999px;
      height: 30px;
      font-size: 22px;
      width: 30px;
      padding-right: 4px;
      color: $main;
      line-height: 30px;
      display: block;
      text-align: center;
      margin-right: 10px;
      font-family: Fanta, sans-serif;


      &.red {
        background: $red
      }
      &.green {
        background: $green;
      }
  }

  }

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