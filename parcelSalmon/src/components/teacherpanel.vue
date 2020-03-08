<template>
  <div style="width: 100%;" class="row">

    <div class="teacherUserArea col-5">
      <div v-for="(user, index) in sharedData.users" :key="user.userid" class="useritemcol">
        <div class="useritem" @click="openMenu(user, index)">
          <div class="name">{{user.name}}</div>
          <div
            class="btn"
            :class="{red: !isgreen[index], green: isgreen[index]}"
            @click="openModal(user)"
          >{{isgreen[index] ? "Green" : "Red"}}</div>
        </div>

        <div class="quickSelect">
          <div 
            v-tooltip="{content: classObj.fullname, offset: '13px'}"
            class="quickSelectItemCont"
            v-for="(classObj, idx) in filteredClasses[index]"
            :key="idx"
          >
            <div
              class="quickSelectItem"
              :class="{red: classObj.status === '0', green: classObj.status === '1'}"
              @click.stop="change(user, classObj.index, index)"
            >
              {{classObj.name[0]}}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-2"></div>

    <div class="teacherClassArea col-5">
      <label class="title">{{ selectedIndex === false ? "Manage User" : sharedData.users[selectedIndex].name }}</label>
      <div class="classItemCont">
        <div 
          class="classItem"
          v-for="(classObj, idx) in filteredClasses[selectedIndex]"
          :key="idx"
          @click.stop="change(sharedData.users[selectedIndex], classObj.index, selectedIndex)"
          :class="{red: classObj.status === '0', green: classObj.status === '1'}"
        >
          {{classObj.name[0]}}
        </div>
      </div>
    </div>



  </div>
</template>

<script>
import commentmodal from "./commentmodal.vue"
import Vue from "vue"
import VTooltip from 'v-tooltip'
import './../css/animations.css'
import { classnames } from "./../js/globals.js";

Vue.use(VTooltip)

export default {
  components: {
    commentmodal
  },
  data() {
    return {
      show: {},
      classnames: classnames,
      selectedIndex: false
    };
  },
  props: ["sharedData"],
  methods: {

    openMenu(user, index) {
      this.selectedIndex = index;
    },
    change(user, idx, userindex) {
      console.log("change", user, idx, userindex)
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
          //If teacher has specific class enabled then set it to object else set to false
          .map((el, i) => {
            return this.sharedData.tclasses[i] === "0" ? false : {index: i, status: el, name: this.sharedData.shortnames[i], fullname: this.classnames[i]};
          })
          // Filter out all false elements
          .filter(el => {return el})
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

<style lang="scss">
@import "../css/settings.scss";

* {
  font-family: 'Fanta', sans-serif; 
  font-weight: 300; 
  font-style: normal;
}


#teacher {
  height: 100% !important;
  margin: 15px 0;
  overflow-x: auto;
}

.editmsg {
  font-size: 9px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.fa-comment {
  width: 18px;
  height: 18px;
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

.teacherUserArea {
  height: calc(100vh - 170px);
  overflow-x: auto;
}

.teacherClassArea {
  height: 20rem;
  background: $main;
  border-radius: 10px;

  .title {
    font-size: 26px;
    margin-top: 10px;
  }

  .classItemCont {
    width: 100%;
    height: 200px;
    display: flex;
    align-items: center;

    .classItem {
      width: 90px;
      height: 90px;
      margin: 10px;
      border-radius: 5px;


      &.red {
        background: #4f6284;
      }

      &.green {
        background: $accent1;
      }
    }
  }
  
}



.useritemcol {
  height: 80px;
  margin-bottom: 20px;
  position: relative;
  display: block;

  .useritem {
    height: fit-content;
    padding: 6px;
    height: 80px;
    width: 100%;
    border-radius: 6px;
    display: inline-flex;
    background: $main;
    font-family: Roboto;
    cursor: pointer;

    .name {
      width: 55%;
      float: left;
      line-height: 28px;
      position: relative;
      font-size: 25px;
      margin: auto 0;
      font-family: futura-pt, sans-serif; 
      font-weight: 300; 
      padding: 0 15px;
      font-style: normal;
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
}


.quickSelect {
  width: fit-content;
  padding: 0 10px;
  height: 80px;
  display: inline-flex;
  position: absolute;
  right: 0;
  top: 0;
  transition: opacity 0.2s;
  font-family: Roboto;
  background: $accent2;
  border-bottom-right-radius: 6px;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 6px;

  .quickSelectItemCont {
    width: 25px;
    height: 25px;
    border-radius: 20px;
    display: inline-block;
    position: relative;
    margin: 4px;


    .quickSelectItem {
      width: 25px;
      height: 25px;
      border-radius: 25px;
      user-select: none;
      cursor: pointer;
      display: block;
      position: relative;
      text-align: center;
      line-height: 25px;
      transition: 0.3s;

      .commentIcon {
        opacity: 0;
        transition: 0.4s;
        position: absolute;
        top: -5px;
        right: -5px;
        width: 20px;
        height: 20px;
        color: black;

        svg {
          position: absolute;
          left: 0;
        }
      }

      &:hover {
        transform: scale(1.1);
        opacity: 0.8;



        .commentIcon {
          opacity: 0.7;
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
}
</style>