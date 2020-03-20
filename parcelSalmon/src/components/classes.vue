<template>
  <div class="col-lg-3 col-xl-3 col-sm-3 col-xs-12 classescontcont">
    <div class="classescont" v-if="!loggedin">
      <div
        v-for="i in [1,2,3,4,5,6]"
        v-bind:key="i"
        :class="{greenclass: i % 2 == 1}"
        class="redclass-item mx-auto z-depth-half"
      >

        <div class="title" style="font-size: 50px;">Lorem Ipsum</div>
        <span class="subtext">{{i % 2 == 1 ? "Completed" : "Missing"}}</span>
      </div>
    </div>
    <div class="classescont" v-if="loggedin">
      <div
        v-for="(classItem, idx) in sharedData.classes"
        v-bind:key="classItem.name"
        :class="{greenclass: classItem.status}"
        class="redclass-item mx-auto z-depth-half"
      >
        <div class="commentPopper" v-if="getComment(idx)">
          <div class="commentBody z-depth-half">{{getComment(idx)}}</div>
        </div>
        <div class="title" :style="{fontSize: titleSize(classItem.name)}">{{classItem.name}}</div>
        <span class="subtext">{{classItem.status ? "Completed" : "Missing"}}</span>
        <div class="commentIcon" v-if="getComment(idx)">
          <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="comment" class="svg-inline--fa fa-comment fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"></path></svg>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  props: ["sharedData", "loggedin"],
  methods: {
    getComment(idx) {
      let returnComment = this.sharedData.comments.find(e => {return e[0] == idx});
      if (returnComment) return returnComment[1];
      else return false;
    },
    titleSize(title) {
      if (title.length > 8) {
        return (3.125 - (title.length - 8) / 4) + "rem"
      } else {
        return "3.125rem"
      }
    }
  },
  computed: {
    sorted() {
      return this.sharedData.classes.sort((a, b) => {
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

.commentIcon {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  color: $accent2;

  svg {
    position: absolute;
    left: 0;
  }
}

.classescont {
  width: 100%;
  height: calc(100vh - 165px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 15px;
  padding-left: 15px;
}


@media screen and (max-width: 768px) {
  .classescont {
    height: auto;
    border-radius: 10px;
    background: $main;
    padding: 25px;
  }
}


.redclass-item {
  border-radius: $curve;
  height: 100px;
  padding: 10px;
  display: block;
  position: relative;
  background: $main1;
  margin-bottom: 40px;

  &:hover {
    .commentPopper {
      .commentBody {
        transform: translateY(7px);
        opacity: 1;
      }
    }
  }

  .commentPopper {
    position: absolute;
    display: flex;
    justify-content: center;
    bottom: -30%;
    left: 0;
    height: 30px;
    width: 100%;

    .commentBody {
      text-align: center;
      width: fit-content;
      height: fit-content;
      opacity: 0;
      transition: 0.25s ease;
      background: $commentcolor;
      z-index: 9;
      line-height: 18px;
      top: 100%;
      transform: translateY(0%);
      max-width: 95%;
      padding: 4px 6px;

      border-radius: 6px;
      font-size: 20px;

      color: $accent2;
      font-family: Fanta, sans-serif;

      &::before {
        width: 0;
        top: -4px;
        left: 50%;
        transform: translateX(-50%);
        position: absolute;
        content: "";
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 7px solid $commentcolor;
      }

    }
  }

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
  
  
  &:nth-last-child(1) {
    margin-bottom: 25px;
  }

  &.greenclass {

    .subtext {
      width: 104px;
      background: $green;
      color: $accent2;
    }

    // background: #c2ffd7;
    .title {
      color: $accent2;
    }
    border: 0;
  }
}
</style>