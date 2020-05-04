<template>
  <div id="headerCont">
    <div class="row">
      <div class="col-12">
        <div id="header" class="z-depth-1">
          <loginButton :loggedin="loggedin" class="loginButton"/>
          <v-popover popoverClass="profilePopover" placement="bottom-end" offset="4">
            <div class="profileIcon">
              <img v-if="profile.picture && profile.picture !== ''" :src="profile.picture" alt="profile picture">
            </div>

            <div class="popoverBody" slot="popover">
              <div class="profilePopoverOption" @click="toggleNightMode()">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 312.812 312.812" v-if="!nightMode">
                  <path d="M305.2,178.159c-3.2-0.8-6.4,0-9.2,2c-10.4,8.8-22.4,16-35.6,20.8c-12.4,4.8-26,7.2-40.4,7.2c-32.4,0-62-13.2-83.2-34.4c-21.2-21.2-34.4-50.8-34.4-83.2c0-13.6,2.4-26.8,6.4-38.8c4.4-12.8,10.8-24.4,19.2-34.4c3.6-4.4,2.8-10.8-1.6-14.4c-2.8-2-6-2.8-9.2-2c-34,9.2-63.6,29.6-84.8,56.8c-20.4,26.8-32.4,60-32.4,96c0,43.6,17.6,83.2,46.4,112s68,46.4,112,46.4c36.8,0,70.8-12.8,98-34c27.6-21.6,47.6-52.4,56-87.6C314,184.959,310.8,179.359,305.2,178.159z"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 302.4 302.4" v-if="nightMode">
                    <path d="M204.8,97.6C191.2,84,172,75.2,151.2,75.2s-40,8.4-53.6,22.4c-13.6,13.6-22.4,32.8-22.4,53.6s8.8,40,22.4,53.6c13.6,13.6,32.8,22.4,53.6,22.4s40-8.4,53.6-22.4c13.6-13.6,22.4-32.8,22.4-53.6S218.8,111.2,204.8,97.6z M190.4,190.4c-10,10-24,16-39.2,16s-29.2-6-39.2-16s-16-24-16-39.2s6-29.2,16-39.2s24-16,39.2-16s29.2,6,39.2,16s16,24,16,39.2S200.4,180.4,190.4,190.4z"/>
                    <path d="M292,140.8h-30.8c-5.6,0-10.4,4.8-10.4,10.4c0,5.6,4.8,10.4,10.4,10.4H292c5.6,0,10.4-4.8,10.4-10.4C302.4,145.6,297.6,140.8,292,140.8z"/>
                    <path d="M151.2,250.8c-5.6,0-10.4,4.8-10.4,10.4V292c0,5.6,4.8,10.4,10.4,10.4c5.6,0,10.4-4.8,10.4-10.4v-30.8C161.6,255.6,156.8,250.8,151.2,250.8z"/>
                    <path d="M258,243.6l-22-22c-3.6-4-10.4-4-14.4,0s-4,10.4,0,14.4l22,22c4,4,10.4,4,14.4,0S262,247.6,258,243.6z"/>
                    <path d="M151.2,0c-5.6,0-10.4,4.8-10.4,10.4v30.8c0,5.6,4.8,10.4,10.4,10.4c5.6,0,10.4-4.8,10.4-10.4V10.4C161.6,4.8,156.8,0,151.2,0z"/>
                    <path d="M258.4,44.4c-4-4-10.4-4-14.4,0l-22,22c-4,4-4,10.4,0,14.4c3.6,4,10.4,4,14.4,0l22-22C262.4,54.8,262.4,48.4,258.4,44.4z"/>
                    <path d="M41.2,140.8H10.4c-5.6,0-10.4,4.8-10.4,10.4s4.4,10.4,10.4,10.4h30.8c5.6,0,10.4-4.8,10.4-10.4C51.6,145.6,46.8,140.8,41.2,140.8z"/>
                    <path d="M80.4,221.6c-3.6-4-10.4-4-14.4,0l-22,22c-4,4-4,10.4,0,14.4s10.4,4,14.4,0l22-22C84.4,232,84.4,225.6,80.4,221.6z"/>
                    <path d="M80.4,66.4l-22-22c-4-4-10.4-4-14.4,0s-4,10.4,0,14.4l22,22c4,4,10.4,4,14.4,0S84.4,70.4,80.4,66.4z"/>
                </svg>
                &nbsp;{{nightMode ? "Light" : "Night"}} Mode
              </div>
              <div class="profilePopoverOption">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="m431.964 435.333c-.921-58.994-19.3-112.636-51.977-151.474-32.487-38.601-76.515-59.859-123.987-59.859s-91.5 21.258-123.987 59.859c-32.646 38.797-51.013 92.364-51.973 151.285 18.46 9.247 94.85 44.856 175.96 44.856 87.708 0 158.845-35.4 175.964-44.667z"/><circle cx="256" cy="120" r="88"/>
                </svg>
                &nbsp;Edit Profile
              </div>
            </div>
          </v-popover>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loginButton from "./loginbutton.vue";
import Vue from "vue";
import VTooltip from 'v-tooltip';
import axios from 'axios';

Vue.use(VTooltip);

export default {
  // props: ["loggedin", "userauth"],
  components: {
    
    loginButton
  },
  computed: {
    profile() {
      return this.$store.state.profile;
    },
    loggedin() {
      return this.$store.state.loggedin;
    },
    nightMode() {
      return this.$store.state.nightMode;
    }
  },
  methods: {
    toggleNightMode() {
      this.$store.commit("setNightMode", !this.nightMode)
    }
  }
};
</script>

<style lang="scss">
@import "../css/settings.scss";

.profilePopover {
  .popover-inner {
    background: $accent2 !important;
  }
  
  .popover-arrow {
    border-color: $accent2 !important;
  }

  .popoverBody {
    .profilePopoverOption {
      width: 10em;
      color: $main;
      font-size: 18px;
      padding: 2px 6px;
      line-height: 36px;
      text-align: left;
      cursor: pointer;
      
      &:nth-child(1) {
        border-bottom: solid 1px black;
        svg {
          padding: 0 2px;
        }
      }

      svg {
        width: 20px;
        transform: translateY(-2px);
        fill: $main;
      }

    }
  }
}
</style>

<style lang="scss" scoped>
@import "../css/settings.scss";

#headerCont {
  .row {
    .col-12 {
      padding: 0;
    }
  }
}

#header {
  background: $accent1;
  height: 90px;
  margin: 1rem 0 0.8rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .profileIcon {
    width: 50px;
    height: 50px;
    border-radius: 80px;
    background: white;
    margin: auto 0;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;


    img {
      height: 52px;
      border-radius: 80px;
    }
  }

  .loginButton {
    position: relative;
  }
}
</style>