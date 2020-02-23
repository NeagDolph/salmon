<template>
    <div class="percent z-depth-half" ref="percent" v-bind:style="{ height: open ? openHeight + 'px' : (setMid == '0px' ? false : (parseInt(setMid) * 2 + 30 + 'px')), transform: open == true ? `translateY(${-(adminTop - globalData.dataTop) + 'px'})` : ''}" @click.stop="open ? false : setMenu(true)" :class="{adminOpen: open, adminClose: !open}">
      <div class="row" v-if="!open">
        <div class="buttonBar" v-bind:style="{ top: setMid }"></div>
      </div>
      <div class="row" v-if="open">
        <h2>Admin Panel<span style="font-size: 23px;"> &gt; {{subsections[subsection]}}</span></h2>
        <div class="adminCloseButton" @click.stop="setMenu(false)">
          <svg class="" viewBox="0 0 24 24">
            <path d="M19 6.41l-1.41-1.41-5.59 5.59-5.59-5.59-1.41 1.41 5.59 5.59-5.59 5.59 1.41 1.41 5.59-5.59 5.59 5.59 1.41-1.41-5.59-5.59z">
            </path>
            <path d="M0 0h24v24h-24z" fill="none">
            </path>
          </svg>
        </div>
        <div class="col-12 body teacher" v-if="subsection == 0">
          <div class="addTeacher">
            <div class="add" @click="toggleAdd()">+ Add</div>
            <input class="emailInput" v-if="addOpen" v-model="teacherEmail" @keyup.enter="toggleAdd()"/>
          </div>
          <br>
          <div class="classSelect z-depth-1" :class="{invis: selectBlink}">
            <div class="selectTitle">
              {{selectedTeacher === false ? "Teachable classes" : sharedData.teacherlist[selectedTeacher][1]}} 
              <svg title="Revoke Teacher" width="20" height="20" v-if="selectedTeacher !== false" @click="delTeacher(sharedData.teacherlist[selectedTeacher][0])">       
                <image xlink:href="https://atischool.net/static/delete.svg" width="20" height="20"/>    
              </svg>
            </div>
            <div v-if="selectedTeacher !== false">
            <div class="classBlock" @click="toggleClass(parseInt(idx))" v-for="(status, idx) in classToggle" :key="'classBlock' + idx" :class="{selected: parseInt(classToggle[idx])}" :style="{content: classToggle[idx] }">
              {{sharedData.shortnames[idx]}}
            </div>
            </div>
          </div>
          <div class="teacherList">
            <div class="teacherItem col-4 z-depth-half" v-for="(teacher, idx) in sharedData.teacherlist" :key="teacher[0]" @click="selectTeacher(idx, teacher[3])">{{teacher[1]}}</div>
          </div>
        </div>
        <div class="menuSelect">
          <div class="menuButton" v-for="(section, idx) in [1, 2, 3, 4]" :key="'section' + idx" :id="'b' + section" :class="{currentMenu: subsection == idx}" @click="setSection(idx)"></div>
        </div>
      </div>

    </div>
</template>

<script>
import axios from 'axios';
import { apiurl } from '../js/globals';

export default {
  data() {
    return {
      buttonHeight: 0,
      open: false,
      setMid: "0px",
      selectBlink: 0,
      adminTop: 0,
      classToggle: "000000000000000",
      selectedTeacher: false,
      subsection: 0,
      openHeight: 800,
      subsections: ["Teachers", "Students", "Admins", "General"],
      addOpen: false,
      teacherEmail: ""
    };
  },
  methods: {
    setSection(section) {
      this.subsection = section;
    },
    toggleAdd() {
      if (!this.addOpen) {
        this.addOpen = true;
      } else {
        if (this.teacherEmail.length >= 1) {
          this.addTeacher(this.teacherEmail, "000000000000000")
        } else {
          this.addOpen = false;
        }
      }
    },
    selectTeacher(idx, classes) {
      this.selectBlink = 1;
      setTimeout(function(e){
        e.selectBlink = 0;
        console.log("AU", e)
      }, 500, this);
      this.selectedTeacher = idx;
      this.classToggle = classes;
    },
    toggleClass(idx) {
      let classCopy = this.classToggle.split("")
      classCopy[idx] = classCopy[idx] == "1" ? "0" : "1"
      this.classToggle = classCopy.join("")

      this.sharedData.teacherlist[this.selectedTeacher][3] = this.classToggle
      console.log("classtog", this.classToggle, this.sharedData.teacherlist[this.selectedTeacher][2])
      this.addTeacher(this.sharedData.teacherlist[this.selectedTeacher][0], this.classToggle, true)
    },
    setMenu(isOpen) {
      this.open = isOpen;
      this.setGlobal("adminOpen", isOpen)
    },
    addTeacher(email, classes, update) {
      axios
        .post(apiurl.addTeacher, { email: email, classes: classes, update: update })
        .then(res => {
          this.teacherEmail = ""
        })
    },
    delTeacher(email) {
      let confirmed = confirm("Are you sure you want to revoke this user's teacher privileges?")
      if (confirmed) { 
        axios
          .post(apiurl.delTeacher, { email: email })
      }
    }
  },
  props: ["classes", "globalData", "sharedData"],
  mounted() {
    this.$nextTick(function() {
      if (this.$refs.percent) {
        this.adminTop = this.$refs.percent.getBoundingClientRect().top
        this.setMid = ((window.innerHeight - this.$refs.percent.getBoundingClientRect().top) / 2 - (13 / 2 /* bar height */)) + "px"
        this.buttonHeight = this.$refs.percent.offsetHeight
        this.openHeight = window.innerHeight - this.globalData.dataTop
      }
    })
  }
};
</script>

<style lang="scss" scoped>
@import "../css/settings.scss";

.menuSelect {
  position: absolute;
  bottom: 35px;
  left: 15px;
  display: block;
  height: 100px;
  width: 25px;
  .menuButton {
    margin: 10px 0;
    width: 85%;
    padding: 0 6px;
    height: 20px;
    display: block;
    position: relative;
    background: $accent2;
    color: white;
    border-radius: 4px;
    transition: 0.4s;
    cursor: pointer;

    &.currentMenu {
      background: $accent1;
    }

    &#b3 {
      padding: 0 5px;
    }
    &#b4 {
      padding: 0 4px;
    }

    &:after {
      display: block;
      line-height: 20px;
      width: 8px;
      overflow: hidden;
      letter-spacing: 3px;
      transition: 0.4s;
    }

    &:hover {
      width: 82px;
      &#b3 {
        width: 70px;
      }
      &#b4 {
        width: 70px;
      }

      &:after {
        width: 100% !important;
        letter-spacing: 0.5px;
      }
    }


    &#b1:after {
      content: "Teachers";
    }
    
    &#b2:after {
      content: "Students";
    }

    &#b3:after {
      content: "Admins";
      width: 10px;
    }

    &#b4:after {
      content: "General";
      width: 12px;
    }
  }

}

.addTeacher {
  text-align: left;
  flex-basis: 100%;
  height: 30px;
  color: rgb(74, 113, 219);
  .emailInput {
    display: inline;
  }
  .add {
    background: white;
    border-radius: 4px;
    height: 30px;
    line-height: 24px;
    padding: 4px 10px;
    display: inline;
    cursor: pointer;
    width: fit-content;
  }
}

.teacherList {
  float: left;
  flex-basis: 100%;
  height: 30vh;
  overflow-x:auto;
  margin-top: 50px;
  .teacherItem {
    height: 50px;
    line-height: 50px;
    text-align: center;
    margin: 10px auto;
    border-radius: 10px;
    display: block;
    cursor: pointer;
    position: relative;
    background: white;
  }
}

.invis > * {
  animation: blinking 0.5s forwards;
}
@keyframes blinking{
    0%  { opacity: 0.5; }
    10% { opacity: 0; }
    100%{ opacity: 1; }
}
.percentRow {
  width: 100%;
  height: fit-content;
  position: relative;
  display: block;
}

.body {
  display: flex;
  justify-content: center;
  flex-basis: 50%;
  flex-flow: row wrap;

  input {
    height: 20px;
    flex-basis: 100%;
  }
}

.classSelect {
  width: 223px;
  margin-top: 10px;
  height: 242px;
  padding: 5px;
  border-radius: 8px;
  background: $background;

  .selectTitle {
    color: $accent2;

    svg {
      float: right; 
      cursor: pointer
    }
  }

  .classBlock {
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
    background: white;

    &.selected {
      background: #ec926b;
      color: white;
    }
  }
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

.buttonBar {
  width: 80%;
  position: relative;
  display: block;
  height: 13px;
  border-radius: 20px;
  background: $background;
}

.percent {
  width: 100%;
  height: 158px;
  padding-bottom: 15px;
  bottom: 0;
  top: calc(57.8vh - 360px);
  transition: 0.5s ease;

  .row {
    justify-content: center;
    display: flex;
    width: 100%;
    margin: 0;
  }


  &.adminClose {
    transition: 0.5s ease, height 1s;
    cursor: pointer;
    &:hover {
      transform: translateY(-15px);
    }
  }

  &.adminOpen {
    transition: 0.5s ease, height 0s;
    box-shadow:0 5px 11px 0 rgba(0,0,0,.18),0 4px 15px 0 rgba(0,0,0,.15)!important;
    .row {
      padding: 1rem;
      display: block;

      h2 {
        text-align: left;
      }


      .adminCloseButton {
        position: absolute;
        top: 0;
        right: 0;
        margin: 1rem;
        padding: 0.4rem;
        background: rgba(0,0,0,0.3);
        border-radius: 50%;
        -webkit-transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        cursor: pointer;

        svg {
          width: 24px;
          fill: #fff;
          pointer-events: none;
          vertical-align: top;
        }

        &:hover {
          background: rgba(0,0,0,0.6);
        }
      }
    }
  }


  background: $main1;
  border-top-left-radius: $curve;
  border-top-right-radius: $curve;
  position: relative;
}

</style>