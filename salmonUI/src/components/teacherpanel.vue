<template>
  <div id="teacher" class="row">
    <div v-for="(user, index) in sharedData.users" :key="user.userid" class="col-12 useritemcol">
      <Popper
        trigger="hover"
        enter-active-class="bounceIn"
        leave-active-class="bounceOut"
        :delay-on-mouse-out="100"
        :options="{
          placement: 'right-start',
        }"
        class="useritemspan mb-4 col-10 col-xl-5 mx-auto z-depth-1"
      >
        <div class="popper z-depth-2">
          <div
            v-for="(status, idx) in filteredClasses[index]"
            :key="idx"
            class="popperBlock"
            :class="{red: status === '0', green: status === '1', cannot: status === '2'}"
            @click.stop="change(user, idx, index)"
          >
            {{sharedData.shortnames[idx]}}
            <div class="commentIcon" @click.stop.prevent="openModal(user)" v-tooltip="{content: getComment(user, idx) + '<span class=\'editmsg\'>Edit (click)</span>', loadingContent: 'Loading...<br/><span class=\'editmsg\'>Edit (click)</span>', offset: '13px'}">
              <i class="fas fa-comment fa-lg"></i>
            </div>
          </div>
        </div>

        <div class="reference" slot="reference">
          <div class="useritem" @click="openModal(user)">
            <div class="name">{{user.name}}</div>
            <div
              class="btn"
              :class="{red: !isgreen[index], green: isgreen[index]}"
              @click="openModal(user)"
            >{{isgreen[index] ? "Green" : "Red"}}</div>
          </div>
        </div>
      </Popper>
    </div>
  </div>
</template>

<script>
import Popper from "vue-popperjs";
import "vue-popperjs/dist/vue-popper.css";
import commentmodal from "./commentmodal.vue"
import Vue from 'vue'
import VTooltip from 'v-tooltip'
import 'animate.css'

Vue.use(VTooltip)

export default {
  components: {
    Popper,
    commentmodal
  },
  data() {
    return {
      show: {}
    };
  },
  props: ["sharedData"],
  methods: {
    openModal(user) {
      console.log("COMMENT")
      this.usereditmodal(true, user);
    },
    change(user, idx, userindex) {
      this.editUserClasses(user, idx, userindex);
    },
    getComment(user, idx) {
      let comment = this.sharedData.users.find(x => x.userid == user.userid).comments[idx]
      return comment ? comment + "<br/>" : ""
    }
  },
  computed: {
    filteredClasses() {
      return this.sharedData.users.map(user => {
        return user.classes
          .split("")
          .map((v, i) => {
            return this.sharedData.tclasses[i] == "0" ? "2" : v;
          })
          .join("");
      });
    },
    isgreen() {
      return this.sharedData.users.map(user => {
        return !user.classes.includes(0);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
$red: #ff6961;
$green: #5cce89;
$zees: main, popper1, popper2;

#teacher {
  height: auto !important;
  margin: 15px 0;
}

.useritemcol {
  height: 90px;
}

.editmsg {
  font-size: 9px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.useritemspan {
  padding: 0px;
  border-radius: 10px;
  background: white;
  display: block;
  font-family: Roboto;
  z-index: index($zees, main);

  // .popper {
  //   opacity: 0;
  //   transition: opacity 0.3s;
  // }

  // &:hover {
  //   .popper {
  //     opacity: 1 !important;
  //   }
  // }
}

.commentPopper {
  .popper {
    z-index: index($zees, popper2);
  }
}

@keyframes bounceIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes bounceOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.bounceIn {
  .popper {
    animation: 200ms ease-in forwards bounceIn;
    animation-duration: 200ms;
    animation-fill-mode: forwards;
  }
}
.bounceOut {
  .popper {
    animation: 200ms ease-out forwards bounceOut;
    animation-duration: 200ms;
    animation-fill-mode: forwards;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 2.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.useritem {
  height: fit-content;
  padding: 6px;
  height: 63px;
  font-family: Roboto;
  cursor: pointer;

  .name {
    width: 60%;
    float: left;
    top: 3px;
    line-height: 18px;
    position: relative;
    margin: 5px;
  }

  .btn {
    float: right;
    right: 15px;
    top: 50%;
    position: absolute;
    transform: translate(0%, -50%);

    &.red {
      background: $red;
      color: white;
    }

    &.green {
      background: $green;
      color: black;
      padding-left: 5px;
      padding-right: 5px;
    }
  }
}

@keyframes visi {
  0% {
    display: none;
  }
  59% {
    display: none;
  }
  60% {
    display: block;
  }
  100% {
    display: block;
  }
}

.useritemspan > span > .popper {
  width: 221px;
  transition: opacity 0.2s;
  font-family: Roboto;
  z-index: index($zees, popper1);

  // opacity: 0;

  .popperBlock {
    width: 45px;
    height: 45px;
    border-radius: 6px;
    user-select: none;
    margin: 4px;
    cursor: pointer;
    float: left;
    text-align: center;
    display: block;
    position: relative;
    line-height: 45px;
    transition: 0.3s;
    z-index: index($zees, popper1);

    .commentIcon {
      opacity: 0;
      transition: 0.4s;
      position: absolute;
      top: -5px;
      right: -5px;
      width: 20px;
      height: 20px;
      color: black;
      z-index: index($zees, popper1);

      svg {
        position: absolute;
        left: 0;
      }
    }

    &:hover {
      transform: scale(1.07);
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);



      .commentIcon {
        opacity: 0.7;
        animation: visi 2s forwards;
      }
    }

    &.green {
      background: $green;
      color: black;
      &:active {
        background: #42a76a;
      }
    }

    &.red {
      background: $red;
      color: white;

      &:active {
        background: #e74f47;
      }
    }

    &.cannot {
      user-select: none;
      pointer-events: none;
      cursor: default;
      background: gray;
      color: black;
    }
  }
}
</style>