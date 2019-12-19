<template>
  <div id="teacher" class="row">
    <div 
      v-for="(user, index) in users"
      :key="user.userid"
      class="col-12">
      <popper 
        trigger="hover"
        enter-active-class="bounceIn"
        leave-active-class="bounceOut"
        :options="{
          placement: 'right-start',
        }" 
        class="useritemspan mb-4 col-10 col-xl-5 mx-auto z-depth-1">
        <div class="popper z-depth-2">
          <div
            v-for="(status, idx) in filteredClasses[index]"
            :key="idx"
            class="popperBlock"
            :class="{red: status === '0', green: status === '1'}"
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
      </popper>
    </div>
  </div>
</template>

<script>
import Popper from "vue-popperjs";
import "vue-popperjs/dist/vue-popper.css";

export default {
  components: {
    popper: Popper
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
        return user.classes.split("").filter((v, i) => {
          return this.tclasses[i] == "1"
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
  height: auto;
  margin: 15px 0;
}

.useritemspan {
  padding: 0px;
  border-radius: 10px;
  background: white;
  display: block;
  font-family: 'Fanta';
  z-index: 1;
}

@keyframes bounceIn {
  from {opacity: 0}
  to {opacity: 1}
}

@keyframes bounceOut {
  0% {opacity: 1;}
  100% {opacity: 0;}
}

.bounceIn {
  .popper {
    animation: bounceIn 300ms ease-in forwards;
    animation-duration: 200ms;
    animation-fill-mode: forwards;
  }
}

.bounceOut {
  .popper {
    animation: 300ms ease-out forwards bounceOut;
    animation-duration: 200ms;
    animation-fill-mode: forwards;
  }
}

.useritem {
  height: fit-content;
  padding: 6px;
  height: 63px;
  font-family: 'Fanta';
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
  
  font-family: 'Fanta';


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

    &:hover {
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

  }
}
</style>