<template>
  <div style="width: 100%;" class="row">

    <div class="teacherUserArea col-5">
      <div v-for="(user, index) in sharedData.userlist" :key="user.userid" class="useritemcol">
        <div v-if="filteredClasses[index].length >= 1">
          <div class="useritem" @click="openMenu(user, index)">
            <div class="name">{{user.name}}</div>
            <div
              class="btn"
              :class="{red: !isgreen[index], green: isgreen[index]}"
              @click="openModal(user)"
            >{{isgreen[index] ? "Green" : "Red"}}</div>
          </div>

          <div class="quickSelect">
            <div class="quickSelectLayer">
              <div 
                class="quickSelectItemCont"
                v-for="(classObj, idx) in filteredClasses[index].length >= 6 ? returnHalf(filteredClasses[index], true) : filteredClasses[index]"
                :key="idx"
                :style="{pointerEvents: classObj.disabled ? 'none' : 'all', background: classObj.disabled ? 'gray' : false}"
              >
                <div
                  class="quickSelectItem" 
                  v-tooltip.top="{content: classObj.fullname, offset: '6px', hideOnTargetClick: false}"
                  :class="{red: classObj.status === '0', green: classObj.status === '1'}"
                  :style="{opacity: classObj.disabled ? 0 : 1}"
                  @click.stop="change(user, classObj.index, index, true)"
                >
                  {{classObj.name[0]}}
                </div>
              </div>
            </div>
            
            <div class="quickSelectLayer" v-if="filteredClasses[index].length >= 6">
              <div 
                class="quickSelectItemCont"
                v-for="(classObj, idx) in returnHalf(filteredClasses[index], false)"
                :key="idx"
                :style="{pointerEvents: classObj.disabled ? 'none' : 'all', background: classObj.disabled ? 'gray' : false}"
              >
                <div
                  class="quickSelectItem" 
                  v-tooltip.top="{content: classObj.fullname, offset: '6px', hideOnTargetClick: false}"
                  :class="{red: classObj.status === '0', green: classObj.status === '1'}"
                  :style="{opacity: classObj.disabled ? 0 : 1}"
                  @click.stop="change(user, classObj.index, index, true)"
                >
                  {{classObj.name[0]}}
                </div>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>

    <div class="col-2"></div>

    <div class="col-5" ref="classRef">
      <div class="teacherClassArea">
        <label class="title">{{ selectedIndex === false ? "Manage User" : sharedData.userlist[selectedIndex].name }}<span class="selecting" v-if="commentSelectMode">Commenting</span> 

        </label>
        <span class="createComment" @click="createComment()" v-if="selectedIndex !== false" v-tooltip.top="{content: (commentSelectMode ? 'Dis' : 'En') + 'able Comment mode', offset: '6px', hideOnTargetClick: false}">
          <svg viewBox="0 -1 401.52289 401" xmlns="http://www.w3.org/2000/svg"><path d="m370.589844 250.972656c-5.523438 0-10 4.476563-10 10v88.789063c-.019532 16.5625-13.4375 29.984375-30 30h-280.589844c-16.5625-.015625-29.980469-13.4375-30-30v-260.589844c.019531-16.558594 13.4375-29.980469 30-30h88.789062c5.523438 0 10-4.476563 10-10 0-5.519531-4.476562-10-10-10h-88.789062c-27.601562.03125-49.96875 22.398437-50 50v260.59375c.03125 27.601563 22.398438 49.96875 50 50h280.589844c27.601562-.03125 49.96875-22.398437 50-50v-88.792969c0-5.523437-4.476563-10-10-10zm0 0"/><path d="m376.628906 13.441406c-17.574218-17.574218-46.066406-17.574218-63.640625 0l-178.40625 178.40625c-1.222656 1.222656-2.105469 2.738282-2.566406 4.402344l-23.460937 84.699219c-.964844 3.472656.015624 7.191406 2.5625 9.742187 2.550781 2.546875 6.269531 3.527344 9.742187 2.566406l84.699219-23.464843c1.664062-.460938 3.179687-1.34375 4.402344-2.566407l178.402343-178.410156c17.546875-17.585937 17.546875-46.054687 0-63.640625zm-220.257812 184.90625 146.011718-146.015625 47.089844 47.089844-146.015625 146.015625zm-9.40625 18.875 37.621094 37.625-52.039063 14.417969zm227.257812-142.546875-10.605468 10.605469-47.09375-47.09375 10.609374-10.605469c9.761719-9.761719 25.589844-9.761719 35.351563 0l11.738281 11.734375c9.746094 9.773438 9.746094 25.589844 0 35.359375zm0 0"/></svg>
        </span>
        <div class="classItemCont">
          <div 
            class="classItem"
            v-for="(classObj, idx) in filteredClasses[selectedIndex]"
            :key="idx"
            @click.stop="change(sharedData.userlist[selectedIndex], classObj.index, selectedIndex)"
            :class="{red: classObj.status === '0', green: classObj.status === '1', selecting: commentSelectMode, selected: commentSelectedIndex == classObj.index}"
          >
            {{classnames[classObj.index]}}
          </div>
        </div>
        <div class="commentarea">
          <textarea class="commentInput" v-model="currentComment" @keyup="updateType($event)" ref="commentInput" :style="{height: textareaHeight + 'px'}" v-if="commentSelectedIndex !== false"></textarea>
          <div class="placeholder" v-if="commentSelectedIndex === false" :style="{height: textareaHeight + 'px'}"></div>
        </div>
      </div>
      
      <adminPanel v-if="sharedData.admin && !isMobile" :globalData="globalData" :sharedData="sharedData"/>
    </div>



  </div>
</template>

<script>
import commentmodal from "./commentmodal.vue"
import Vue from "vue"
import VTooltip from 'v-tooltip'
import './../css/animations.css'
import { classnames, shortnames } from "./../js/globals.js";
import commentmodalVue from './commentmodal.vue'
import adminPanel from "./adminPanel.vue";

Vue.use(VTooltip)

export default {
  components: {
    commentmodal,
    adminPanel
  },
  data() {
    return {
      show: {},
      classnames: classnames,
      selectedIndex: false,
      typingComment: false,
      commentSelectMode: false,
      commentSelectedIndex: false,
      currentComment: "",
      setLineHeight: 24,
      textareaHeight: 34,
      currentName: "",
      shortnames: shortnames,
      typetimer: {}
    };
  },
  props: ["sharedData", "isMobile", "globalData"],
  methods: {
    returnHalf(array, first=true) {
      if (first) return array.slice(0, Math.ceil(array.length / 2));
      else return array.slice(Math.ceil(array.length / 2));
    },
    updateType(eventObj) {
      let inputValue = eventObj.target.value
      let currentUserId = this.sharedData.userlist[this.selectedIndex].userid

      this.textareaHeight = inputValue.match(/\n/g) ? inputValue.match(/\n/g).length * this.setLineHeight + this.setLineHeight + 10 : this.setLineHeight + 10

      try {
        clearTimeout(this.typetimer[currentUserId][this.commentSelectedIndex])
      } catch {}
      
      if (!this.typetimer[currentUserId]) this.typetimer[currentUserId] = []
      this.typetimer[currentUserId][this.commentSelectedIndex] = setTimeout((passedInput) => {
        this.addComment(passedInput[0], passedInput[1], passedInput[2])
      }, 500, [{userid: currentUserId, index: this.selectedIndex}, this.commentSelectedIndex, inputValue])

    },
    createCommentSecond(index) {
      if (this.commentSelectMode) {
        this.commentSelectedIndex = index
        this.typingComment = true;
        this.currentComment = this.sharedData.userlist[this.selectedIndex].comments[index]
        this.textareaHeight = this.currentComment.match(/\n/g) ? this.currentComment.match(/\n/g).length * this.setLineHeight + this.setLineHeight + 10: this.setLineHeight + 10
        setTimeout(() => {this.$refs.commentInput.focus()}, 100)
      }
    },
    createComment() {
      if (!this.commentSelectMode && this.selectedIndex !== false) {
        this.commentSelectMode = true;
        return
      } else if (this.commentSelectMode) {
        this.commentSelectMode = false;
        this.currentComment = ""
        this.commentSelectedIndex = false;
        return
      }
    },
    openMenu(user, index) {
      this.currentComment = "";
      this.commentSelectMode = false;
      this.typingComment = false;
      this.commentSelectedIndex = false;
      this.selectedIndex = index;
    },
    change(user, idx, userindex, quick=false) {
      if (this.commentSelectMode && !quick) {
        this.createCommentSecond(idx)
        this.currentName = this.classnames[idx]
        return
      }

      this.editUserClasses(user, idx, userindex);
    },
    getComment(user, idx) {
      let comment = this.sharedData.userlist.find(x => x.userid == user.userid).comments[idx]
      return comment ? comment + "<br/>" : ""
    }
  },
  computed: {
    filteredClasses() {
      if (!this.sharedData.userlist) return []
      return this.sharedData.userlist.map(user => {
        return user.classes
          .split("")
          //If teacher has specific class enabled then set it to object else set to false
          .map((el, i) => {
            return this.sharedData.tclasses[i] === "0" ? false : {disabled: user.studentclasses[i] === "0", index: i, status: el, name: this.shortnames[i], fullname: this.classnames[i]};
          })
          // Filter out all false elements
          .filter(el => {return !!el})
      });
    },
    isgreen() {
      return this.sharedData.userlist.map(user => {
        return !user.classes.includes(0);
      });
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.setGlobal("dataTop", this.$refs.classRef.getBoundingClientRect().top)
    })
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


  .commentarea {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    width: 100%;
    position: relative;
    top: 30px;
    background: $main;
    border-radius: 10px;
    box-shadow:0 0px 6px 0 rgba(0,0,0,.16),0 0px 6px 0 rgba(0,0,0,.12);


    .placeholder {
      width: 100%;
      border-radius: 6px;
      background: $accent3;
    }
    .commentInput {
      border-radius: 6px;
      width: 100%;
      background: $accent3;
      padding: 5px;
      border: 0;
      outline: 0;
    }
  }

  height: 20rem;
  background: $main;
  border-radius: 10px;

  .createComment {
    width: 20px;
    right: 30px;
    position: absolute;
    display: block;
    top: 25px;
    height: 20px;
    cursor: pointer;
    outline: 0;

    svg {
      position: relative;
      width: 100%;
      display: block;
      height: 100%;
    }
  }

  .title {
    font-size: 26px;
    margin-top: 10px;
    display: flex;
    padding-top: 10px;
    padding-left: 10px;
    align-items: center;
    height: 40px;

    .selecting {
      height: 22px;
      font-size: 14px;
      line-height: 15px;
      color: white;
      background: $red;
      margin-left: 10px;
      padding: 4px;
      border-radius: 4px;
    }
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
      text-align: center;
      transition: 0.3s;
      position: relative;
      display: block;
      border-radius: 5px;


      &.red {
        background: #4f6284;
      }

      &.green {
        background: $accent1;
      }

      &.selecting {
        background: $accent2;
        color: white;
        &.selected::after {
          opacity: 1;
        }
      }



      &::after {
        opacity: 0;
        transition: opacity 0.3s;
        display: block;
        position: absolute;
        bottom: 0;
        margin: 0;
        background: $background;
        width: 100%;
        color: $accent2;
        content: "Selected";
        line-height: 20px;
        font-size: 14px;
        text-align: center;
        height: 20px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        }
    }
  }
  
}



.useritemcol {
  height: fit-content;
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
    margin-bottom: 20px;

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
  min-width: 7rem;
  width: fit-content;
  padding: 8px 10px;
  height: 80px;
  display: flex;
  flex-direction: column;
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

  .quickSelectLayer {
    margin: auto 0;
  }

  .quickSelectItemCont {
    width: 25px;
    height: 25px;
    border-radius: 20px;
    display: inline-block;
    position: relative;
    margin: 4px;

    &.disabled {
      .quickSelectItem {
        background: gray !important;
      }
    }


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