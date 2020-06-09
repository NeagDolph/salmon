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
      <div class="classItemCont" v-for="classItem in userData.classes" v-bind:key="classItem.name">

        <div v-if="!getComment[classItem.index]" :class="{greenclass: classItem.status}" class="redclass-item mx-auto z-depth-half">
          <svg class="title" viewBox="-1 3 150 19"><text x="0" y="15">{{classItem.name}}</text></svg>
          <span class="subtext">{{classItem.status ? "Completed" : "Missing"}}</span>
          <div class="commentIcon" v-if="getComment[classItem.index]">
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="comment"
              class="svg-inline--fa fa-comment fa-w-16"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"
              />
            </svg>
          </div>
        </div>

        <v-popover v-if="getComment[classItem.index]" placement="left" offset="8" popoverWrapperClass="z-depth-half classPopper" trigger="hover">
          <div :class="{greenclass: classItem.status}" class="redclass-item mx-auto z-depth-half">
            <svg class="title" viewBox="-1 3 150 19"><text x="0" y="15">{{classItem.name}}</text></svg>
            <span class="subtext">{{classItem.status ? "Completed" : "Missing"}}</span>
            <div class="commentIcon" v-if="getComment[classItem.index]">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="comment"
                class="svg-inline--fa fa-comment fa-w-16"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"
                />
              </svg>
            </div>
          </div>

          <div class="commentBody" slot="popover">
            <pre>{{getComment[classItem.index]}}</pre>
          </div>
        </v-popover>

      </div>
    </div>
  </div>
</template>


<script>
import Vue from "vue"
import VTooltip from 'v-tooltip'

Vue.use(VTooltip, {
    defaultBoundariesElement: 'body',
    defaultPopperOptions: {},
    popover: {
      defaultBoundariesElement: 'body',
    }
})

export default {
  computed: {
    loggedin() {
      return this.$store.state.loggedin;
    },
    userData() {
      return this.$store.state.user;
    },
    getComment(idx) {
      let emptyarr = Array(10);
      this.$store.state.user.comments.forEach(el => {
        emptyarr[el.class] = el.comment
      })
      return emptyarr
    },

  },
  methods: {

  }
};
</script>

<style lang="scss">
@import "../css/settings.scss";

.v-popover {
  & > div {
    display: block !important;
  }
}

.tooltip.popover {
  outline: 0 !important;

  .classPopper {
    .popover-inner {
      background: $main;
    }

    .popover-arrow {
      border-color: $main;
    }

    .tooltip-inner {
      max-width: unset !important;
    }
  }
}

@media only screen and (max-width: 850px) {
  .redclass-item {
    display: flex !important;
    justify-content: center;
  }
}

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
  height: calc(100vh - 152px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 5px;
  padding-left: 5px;
}

@media screen and (max-width: 768px) {
  .classescont {
    height: auto;
    border-radius: 10px;
    background: $main;
    padding: 25px;
  }
}

.commentBody {
  width: fit-content;
  height: fit-content;
  padding: 4px 6px;
  font-size: 20px;
  color: $accent2;
  font-family: Fanta, sans-serif;

  pre {
    white-space: pre-wrap;
    padding: 0;
    margin: 0;
    line-height: 20px;
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

  .title {
     height: 35px;

    text {
      font-family: mr-eaves-modern, sans-serif;
      font-weight: 200;
      font-size: 17px;
    }
  }

  .subtext {
    text-align: center;
    font-size: 21px;
    color: white;
    width: 65px;
    position: absolute;
    bottom: 10px;
    background: $red;
    font-family: futura-pt, sans-serif;
    font-weight: 400;
    font-style: normal;
    line-height: 29px;
    padding-bottom: 0px;
    font-size: 18px;
    border-radius: 12px;
    display: block;
  }

  &:nth-last-child(1) {
    margin-bottom: 25px;
  }

  &.greenclass {
    .subtext {
      width: 90px;
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