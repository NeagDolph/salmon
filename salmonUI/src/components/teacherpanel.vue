<template>
  <div id="teacher" class="row">
    <div 
      v-for="(user, index) in users"
      :key="user.userid"
      class="col-12 useritemcol">
      <Popper 
        trigger="hover"
        transition='fade'
        enter-active-class='fade-enter-active'
        leave-active-class='fade-leave-active'
        :options="{
          placement: 'right-start',
        }" 
        class="useritemspan mb-4 col-10 col-xl-5 mx-auto z-depth-1">
          <div class="popper z-depth-2">
            <div
              v-for="(status, idx) in filteredClasses[index]"
              :key="idx"
              class="popperBlock"
              :class="{red: status === '0', green: status === '1', cannot: status === '2'}"
              @click="change(user, idx, index)"
            >
              {{shortnames[idx]}}
            </div>
          </div>

        <div class="reference" slot="reference">
          <div class="useritem" @click="mod(user)">
            <div class="name">{{user.name}}</div>
            <div
              class="btn"
              :class="{red: !isgreen[index], green: isgreen[index]}"
              @click="mod(user)"
            >{{isgreen[index] ? "Green" : "Red"}}</div>
          </div>
        </div>
      </Popper>
      
        </transition>
    </div>
  </div>
</template>

<script>
import Popper from "vue-popperjs";
import "vue-popperjs/dist/vue-popper.css";

export default {
  components: {
    Popper
  },
  data() {
    return {
      show: {}
    }
  },
  props: ["users", "tclasses", "shortnames"],
  methods: {
    mod(user) {
      this.usereditmodal(user)
    },
    change(user, idx, userindex) {
      this.editUserClasses(user, idx, userindex)
    }
  },
  computed: {
    filteredClasses() {
      return this.users.map(user => {
        return user.classes.split("").map((v, i) => {
          return this.tclasses[i] == "0" ? "2" : v
        }).join("")
      })
    },
    isgreen() {
      return this.users.map(user => {
        return !user.classes.includes(0)
      });
    }
  }
};
</script>

<style lang="scss" scoped>
$red: #ff6961;
$green: #5cce89;

#teacher {
  height: auto !important;
  margin: 15px 0;
}

.useritemcol {
  height: 90px;
}

.useritemspan {
  padding: 0px;
  border-radius: 10px;
  background: white;
  display: block;
  font-family: Roboto;
  z-index: 1;
}

@keyframes bounceIn {
  from {opacity: 0}
  to {opacity: 1}
}
@keyframes bounceOut {
  0% {opacity: 1; z-index: 999}
  20% {z-index: -1}
  100% {opacity: 0; z-index: -1}
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 2.5s;
}
.fade-enter, .fade-leave-to {
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
    top:3px;
    line-height: 18px;
    position: relative;
    margin: 5px;
  }

  .btn {
    float: right;
    right: 15px;
    top: 50%;
    position: absolute;
    transform: translate(0%,-50%);

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

.popper {
  width: 221px;
  
  font-family: Roboto;


  .popperBlock {
    width: 45px;
    height: 45px;
    border-radius: 6px;
    user-select: none;
    margin: 4px;
    cursor: pointer;
    float: left;
    text-align: center;
    line-height: 45px;
    transition: 0.3s;

    &.green:hover, &.red:hover {
      transform: scale(1.07);
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
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