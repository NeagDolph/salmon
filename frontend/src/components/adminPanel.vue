<template>
    <div class="percent z-depth-half" ref="percent" v-bind:style="{ height: open ? (windowHeight - dataTop) + 'px' : false, transform: open == true ? `translateY(${-((adminTop - dataTop) + buttonTop) + 'px'})` : '', top: buttonTop + 'px'}" @click.stop="open ? false : setMenu(true)" :class="{adminOpen: open === 1, adminClose: open === 0, adminLoad: open === false}">
      <div class="row" v-if="!open">
        <div class="buttonBar" v-bind:style="{ top: setMid + 'px' }"></div>
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
            <input class="emailInput" :class="{inputAnimate: addOpen}" ref="teacherEmail" v-model="teacherEmail" @keyup.enter="toggleAdd()" @keyup="searchCompute()"/>
            <div class="emailSearch z-depth-1-half" v-if="teacherEmail.length >= 1" >
              <div class="searchResult" v-for="result in searchResults" :key="result.email" @click="setTeacherEmail(result.email)">
                {{result.name}}
              </div>
            </div>
          </div>
          <br>
          <div class="classSelect z-depth-1" v-if="selectedTeacher !== false">
            <div class="selectTitle">
              {{userData.teacherlist[selectedTeacher].name}} 
              <a @click="delTeacher(userData.teacherlist[selectedTeacher].email, true)" style="text-decoration: none; color: black;">
                <svg title="Revoke Teacher" width="20" height="20" v-if="selectedTeacher !== false">       
                  <image href="https://atischool.net/static/delete.svg" width="20" height="20"/>    
                </svg>
              </a>
            </div>
            <div v-if="selectedTeacher !== false">
            <div class="classBlock" @click="teacherToggleClass(parseInt(idx))" v-for="(status, idx) in teacherClassToggle" :key="'classBlock' + idx" :class="{selected: parseInt(teacherClassToggle[idx])}" :style="{content: teacherClassToggle[idx] }">
              {{shortnames[idx]}}
            </div>
            </div>
          </div>
          <div class="userList" ref="userlist" :style="{height: listHeight + 'px'}">
            <div class="userItem col-4 z-depth-half" v-for="(teacher, idx) in userData.teacherlist"  v-tooltip.bottom="{content: teacher.name, offset: '2px'}" :key="teacher.email" @click="selectTeacher(idx)">{{teacher.name.split(" ")[0]}}</div>
          </div>
        </div>
        
        <div class="col-12 body student" v-if="subsection == 1">
          <div class="classSelect z-depth-1" v-if="selectedStudent !== false">
            <div class="selectTitle">
              {{userData.userlist[selectedStudent].name}} 
            </div>
            <div v-if="selectedStudent !== false">
            <div class="classBlock" @click="studentToggleClass(parseInt(idx))" v-for="(status, idx) in userData.userlist[selectedStudent].studentclasses" :key="'classBlock' + idx" :class="{selected: parseInt(userData.userlist[selectedStudent].studentclasses[idx])}" :style="{content: userData.userlist[selectedStudent].studentclasses[idx] }">
              {{shortnames[idx]}}
            </div>
            </div>
          </div>
          <div class="userList" ref="userlist" :style="{height: listHeight + 'px'}">
            <div class="userItem col-4 z-depth-half" v-tooltip.bottom="{content: student.name, offset: '2px'}" v-for="(student, idx) in userData.userlist" :key="student.email" @click="selectStudent(idx)">{{student.name.split(" ")[0]}}</div>
          </div>
        </div>


        <div class="menuSelect">
          <div class="menuButton" v-for="(section, idx) in [1, 2, 3, 4]" :key="'section' + idx" :id="'b' + section" :class="{currentMenu: subsection == idx}" @click="setSection(idx)"></div>
        </div>
      </div>

    </div>
</template>

<script>
import Vue from "vue";
import axios from 'axios';
import VTooltip from 'v-tooltip'

import { apiurl, shortnames } from '../js/globals';
import Fuse from 'fuse.js';

Vue.use(VTooltip)

export default {
  data() {
    return {
      buttonTop: 0,
      open: false,
      setMid: "0px",
      adminTop: 0,
      studentClassToggle: "000000000000000",
      teacherClassToggle: "000000000000000",
      selectedTeacher: false,
      selectedStudent: false,
      subsection: 0,
      subsections: ["Teachers", "Students", "Logs", "General"],
      addOpen: false,
      teacherEmail: "",
      searchResults: [],
      listHeight: false,
      shortnames: shortnames,
      windowHeight: window.innerHeight,
    };
  },
  methods: {
    searchCompute() {
      let userinput = this.$store.state.user.userlist.map(user => {
        return {
          email: user.email,
          name: user.email
        }
      })


      var fuse = new Fuse(userinput, {
        keys: [{
          name: 'email',
          weight: 0.8
        }, {
          name: 'name',
          weight: 0.2
        }]
      });

      this.searchResults = fuse.search(this.teacherEmail);
      return this.searchResults
    },
    setTeacherEmail(email) {
      this.teacherEmail = email;
      this.$refs.teacherEmail.focus()
    },
    setSection(section) {
      this.subsection = section;
      this.selectedStudent = false
      this.selectedTeacher = false
      this.listHeight = 800
    },
    toggleAdd() {
      if (!this.addOpen) {
        this.addOpen = true;
        this.$refs.teacherEmail.focus()
      }
      else {
        if (this.teacherEmail.length) this.addTeacher(this.teacherEmail, "000000000000000", false, res => {
          if (res.data == "queue") {console.log("User added to queue"); return}
          
          this.teacherEmail = ""

          let userIndex = this.$store.state.user.teacherlist.findIndex(e => {return e[0] == this.teacherEmail})
          
          if (userIndex > -1) this.selectedTeacher = userIndex
        });
        else this.addOpen = false;
      }
    },
    selectTeacher(idx) {
      setTimeout(this.dataCalc, 100)
      this.selectedTeacher = idx;
      this.teacherClassToggle = this.$store.state.user.teacherlist[idx].teacherclasses
    },
    selectStudent(idx) {
      setTimeout(this.dataCalc, 100)
      this.selectedStudent = idx;
      this.studentClassToggle = this.$store.state.user.userlist[idx].studentclasses
    },
    teacherToggleClass(idx) {
      let classCopy = this.teacherClassToggle.split("")
      classCopy[idx] = classCopy[idx] == "1" ? "0" : "1"
      this.teacherClassToggle = classCopy.join("")

      this.$store.state.user.teacherlist[this.selectedTeacher].teacherclasses = this.teacherClassToggle
      
      let email = this.$store.state.user.teacherlist[this.selectedTeacher].email

      this.addTeacher(email, this.teacherClassToggle, true, () => {})
    },
    studentToggleClass(idx) {
      let userid = this.$store.state.user.userlist[this.selectedStudent].userid
      let studentclasses = this.$store.state.user.userlist[this.selectedStudent].studentclasses

      this.userEditEnrolled(userid, studentclasses, idx, this.selectedStudent)
    },
    setMenu(isOpen) {
      this.open = isOpen ? 1 : 0;
      this.$store.commit("adminOpen", isOpen)
      setTimeout(this.dataCalc, 400)
    },
    delTeacher(email, clear=false) {
      let confirmed = confirm("Are you sure you want to revoke this user's teacher privileges?")
      console.log("EE", email)
      if (confirmed) axios
          .delete(apiurl.teacher + email)
          .then(e => {
            if (clear) {
              this.selectedTeacher = false;
              this.listHeight = 800
            }
          })
    },
    dataCalc() {
      if (this.$refs.userlist) {
        this.listHeight = window.innerHeight - this.$refs.userlist.getBoundingClientRect().top
      }
    }
  },
  computed: {
    dataTop() {
      return this.$store.state.adminPanel.dataPx;
    },
    userData() {
      return this.$store.state.user;
    }
  },
  mounted() {
    this.$nextTick(function() {
      if (this.$refs.percent) {
        this.buttonTop = (window.innerHeight - this.$refs.percent.getBoundingClientRect().top) - this.$refs.percent.offsetHeight + 15
        this.adminTop = this.$refs.percent.getBoundingClientRect().top
        this.setMid = ((this.$refs.percent.offsetHeight - 15) / 2) - (13 / 2 /* bar height */)
      }
      this.dataCalc()
    });
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
      padding: 0 6px;
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
        width: 50px;
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
      width: 10px;
    }

    &#b3:after {
      content: "Logs";
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
    border: 0;
    height: 26px;
    border: solid 1px gray;
    border-radius: 5px;
    margin-left: -2px;
    outline: 0;
    padding: 2px;
    width: 0px;
    transition: width 0.6s, opacity 0.3s;
    opacity: 0;

    &.inputAnimate {
      width: 160px;
      opacity: 1;
    }
  }
  .add {
    background: white;
    border-radius: 4px;
    border: solid 1px gray;
    // height: 30px;
    line-height: 24px;
    padding: 4px 10px;
    display: inline;
    cursor: pointer;
    // width: fit-content;
  }
  .emailSearch {
    display: block;
    width: fit-content;
    height: fit-content;
    overflow-y: auto;
    background: white;
    margin-left: 66px;
    border-radius: 5px;
    position: relative;
    margin-top: 5px;
    z-index: 1;

    .searchResult {
      height: 25px;
      cursor: pointer;
      text-align: center;
      line-height: 25px;
      width: 100%;
      padding: 0 5px;
    }
  }
}

.userList {
  float: left;
  flex-basis: 100%;
  height: 30vh;
  overflow-x:auto;
  margin-top: 20px;
  .userItem {
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
  height: 130px;
  top: 100vh;
  padding-bottom: 15px;
  bottom: 0;
  transition: transform 0.5s ease, height 0s;

  .row {
    justify-content: center;
    display: flex;
    width: 100%;
    margin: 0;
  }

  &.adminLoad {
    &:hover {
      transform: translateY(-15px);
    }
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