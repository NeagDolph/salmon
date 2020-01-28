<template>
<<<<<<< HEAD
  <div class="col-4 col-xl-3">
    <div class="row">
      <div class="col-12 chart z-depth-1">
        <div
          :class="{yescampus: percent == 100, nocampus: percent < 100}"
        >{{percent == 100 ? "You have offcampus" : "You don't have offcampus"}}</div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 percentage z-depth-1">
        <div class="balltext balltop">{{percent < 100 ? "Red" : "Green"}} in</div>
        <div class="ball" :class="{yescampus: percent == 100}">{{percent < 100 ? ((100 - percent).toFixed(1)) : 100}}%</div>
        <div class="balltext">Of classes</div>
=======
  <div class="col-6 col-xl-6 col-lg-6">
    <div class="percent z-depth-half">
      <div class="row" style="width: 100%; margin: 0;">
        <div class="col-12 px-0 mx-0">
          <div class="statusCont">
            <svg class="statusMarker" v-if="perc < 100" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <path d="m437.019531 74.980469c-48.351562-48.351563-112.640625-74.980469-181.019531-74.980469s-132.667969 26.628906-181.019531 74.980469c-48.351563 48.351562-74.980469 112.640625-74.980469 181.019531 0 68.382812 26.628906 132.667969 74.980469 181.019531 48.351562 48.351563 112.640625 74.980469 181.019531 74.980469s132.667969-26.628906 181.019531-74.980469c48.351563-48.351562 74.980469-112.636719 74.980469-181.019531 0-68.378906-26.628906-132.667969-74.980469-181.019531zm-70.292969 256.386719c9.761719 9.765624 9.761719 25.59375 0 35.355468-4.882812 4.882813-11.28125 7.324219-17.679687 7.324219s-12.796875-2.441406-17.679687-7.324219l-75.367188-75.367187-75.367188 75.371093c-4.882812 4.878907-11.28125 7.320313-17.679687 7.320313s-12.796875-2.441406-17.679687-7.320313c-9.761719-9.765624-9.761719-25.59375 0-35.355468l75.371093-75.371094-75.371093-75.367188c-9.761719-9.765624-9.761719-25.59375 0-35.355468 9.765624-9.765625 25.59375-9.765625 35.355468 0l75.371094 75.367187 75.367188-75.367187c9.765624-9.761719 25.59375-9.765625 35.355468 0 9.765625 9.761718 9.765625 25.589844 0 35.355468l-75.367187 75.367188zm0 0"/>
            </svg>

            <svg class="statusMarker" :class="{green: perc == 100}" v-if="perc == 100" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <path d="M437.019,74.98C388.667,26.629,324.38,0,256,0C187.619,0,123.332,26.629,74.98,74.98C26.629,123.332,0,187.62,0,256 s26.629,132.667,74.98,181.019C123.332,485.371,187.62,512,256,512s132.667-26.629,181.019-74.98 C485.371,388.667,512,324.38,512,256S485.371,123.333,437.019,74.98z M378.306,195.073L235.241,338.139 c-2.929,2.929-6.768,4.393-10.606,4.393c-3.839,0-7.678-1.464-10.607-4.393l-80.334-80.333c-5.858-5.857-5.858-15.354,0-21.213 c5.857-5.858,15.355-5.858,21.213,0l69.728,69.727l132.458-132.46c5.857-5.858,15.355-5.858,21.213,0 C384.164,179.718,384.164,189.215,378.306,195.073z"/>
            </svg>
          </div>
        </div>
        <div class="col-12">
          <div id="pieCont" :class="{orangePointer: perc <= 37.5}">
            <div class="pie" id="pie1"></div>
            <div
              class="pie"
              id="pie2"
              :class="{full: perc == 100}"
              :style="{backgroundImage: `conic-gradient(#32326b ${perc - 0.01}%, transparent 0.01%, transparent ${100 - perc}%)`}"
            >
              <svg class="smile" v-if="perc == 100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10000 10000" preserveAspectRatio="xMidYMid meet">
                <path d="M4620 9604 c-710 -46 -1270 -187 -1900 -479 -592 -274 -1323 -769 -1719 -1166 -485 -485 -713 -1005 -801 -1832 -84 -783 -26 -1407 181 -1953 103 -271 286 -612 487 -909 715 -1058 1735 -1885 2827 -2290 793 -295 1612 -361 2400 -194 987 208 1872 792 2540 1674 111 146 250 356 345 520 67 116 240 457 240 473 0 5 12 13 26 16 34 9 60 38 144 161 409 602 504 1409 270 2310 -288 1111 -1056 2160 -2082 2844 -668 445 -1471 727 -2298 805 -154 15 -555 27 -660 20z m720 -308 c1002 -125 1876 -513 2607 -1158 496 -438 965 -1075 1242 -1690 287 -637 388 -1222 310 -1783 -10 -69 -15 -85 -29 -85 -10 0 -22 -6 -28 -12 -5 -7 -29 -85 -51 -173 -23 -88 -68 -243 -102 -345 -58 -176 -65 -191 -146 -313 l-86 -127 6 -52 c6 -50 4 -57 -68 -194 -383 -732 -893 -1315 -1525 -1743 -547 -371 -1132 -588 -1772 -657 -183 -20 -577 -22 -753 -5 -585 58 -1097 206 -1633 471 -1043 514 -1940 1400 -2488 2455 -411 792 -504 1789 -255 2760 49 191 96 315 182 486 302 597 891 1121 1825 1623 380 204 744 344 1144 440 234 57 439 89 755 120 22 2 195 3 385 1 249 -2 383 -7 480 -19z"/>
                <path d="M4810 6891 c-209 -45 -404 -163 -547 -330 -184 -215 -331 -507 -388 -771 -34 -156 -29 -478 7 -502 23 -14 65 -8 83 12 14 16 20 46 26 131 19 264 119 526 302 799 82 122 234 279 320 329 137 80 323 117 503 100 452 -42 742 -284 853 -712 45 -174 55 -276 55 -595 l1 -304 28 -24 c53 -45 174 -25 206 35 29 53 49 477 32 666 -34 376 -139 634 -340 836 -151 150 -325 245 -571 311 -105 28 -131 31 -300 34 -152 3 -200 1 -270 -15z"/>
                <path d="M2493 4503 c-35 -7 -71 -47 -83 -94 -15 -55 -6 -183 20 -282 10 -40 26 -99 35 -132 55 -209 188 -352 370 -400 151 -39 311 8 425 124 124 127 195 345 170 524 -13 91 -35 128 -85 145 -85 28 -128 -7 -150 -122 -50 -262 -137 -436 -219 -436 -50 0 -133 46 -189 103 -96 97 -147 246 -147 422 0 99 -9 121 -55 141 -34 14 -50 15 -92 7z"/>
                <path d="M7453 4215 c-47 -20 -63 -53 -73 -154 -25 -238 -91 -365 -204 -389 -154 -33 -235 76 -271 363 -8 57 -45 105 -81 105 -13 0 -26 5 -29 10 -9 15 -78 12 -102 -5 -34 -24 -46 -78 -39 -169 14 -183 70 -313 186 -426 101 -99 151 -124 257 -128 226 -10 406 124 490 365 24 70 27 92 28 213 0 110 -3 142 -18 171 -28 56 -80 72 -144 44z"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="col-12 px-0 mx-0">
          <div class="pieDataCont">
            <div class="pieData">
              {{perc}}%
              <br />
              <span class="subPercent" v-if="perc > 0 && perc < 100">
                {{100 - perc}}%
                <span class="offTarget">off target</span>
              </span>
            </div>
          </div>
        </div>
>>>>>>> 1a29e0a... poop
      </div>
    </div>
  </div>
</template>

<script>
export default {
<<<<<<< HEAD
=======
  data() {
    return {
      perc: 60
    };
  },
>>>>>>> 1a29e0a... poop
  props: ["classes"],
  methods: {},
  computed: {
    percent() {
      return parseInt(
        (
          (this.classes.reduce((tot, el) => {
            return tot + el.status;
          }, 0) /
            this.classes.length) *
          100
        ).toFixed(1)
      );
    }
  }
};
</script>

<style lang="scss" scoped>
$red: #ff6961;
$green: #5cce89;
$sub: #d8f4f7;
$main1: #364f6b;

<<<<<<< HEAD
.chart {
  height: 42vh;
  background: $main1;
  border-bottom-left-radius: 2000px;
  border-bottom-right-radius: 2000px;
  font-family: 'Fanta';

  div {
    text-align: center;
    font-size: 36px;
    margin-top: 100px;
  }
=======
@media screen and (max-width: 1100px) {
  #pieCont {
    width: calc(20em - 6vw) !important;
    height: calc(20em - 6vw) !important;
  }
}

@media screen and (min-width: 1200px) {
  .statusMarker {
    width: calc(2em + 1.5vw) !important;
    height: calc(2em + 1.5vw) !important;
    margin-top: calc(2.5vw - 20px) !important;
  }
}

@media screen and (max-width: 1100px) {
  #pieCont {
    width: calc(20em - 6vw) !important;
    height: calc(20em - 6vw) !important;
  }
}

@media screen and (min-width: 1200px) {
  .statusMarker {
    width: calc(2em + 1.5vw) !important;
    height: calc(2em + 1.5vw) !important;
    margin-top: calc(2.5vw - 20px) !important;
  }
}

.percentRow {
  width: 100%;
  height: fit-content;
  position: relative;
  display: block;
}

.statusCont {
  width: 29%;
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

.pie {
  width: 100%;
  height: 100%;
  position: absolute;
  transition: backgroundImage 400ms;
  border-radius: 9999px;
  filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.3));

  .balltext {
    text-align: center;
    margin-top: 10px;
    font-size: 36px;
    color: white;
  }
=======

  &#pie2 {
    display: flex;
    align-content: center;
    justify-content: center;

    .smile {
      display: block;
      position: relative;
      width: 200px;
      transform: rotateY(18deg);
      fill: $main;
    }
  }

  &#pie2 {
    display: flex;
    align-content: center;
    justify-content: center;

    .smile {
      display: block;
      position: relative;
      width: 200px;
      transform: rotateY(18deg);
      fill: $main;
    }
  }
}

.pieDataCont {
  width: 38%;
  display: flex;
  height: auto;
  float: right;
  justify-content: center;
  position: relative;
  .pieData {
    width: fit-content;
    line-height: 20px;
    margin: 0 auto;
    height: 60px;
    font-size: 50px;
    font-weight: 100;
    bottom: -10px;
    color: $accent2;
    float: right;
    display: block;
    font-family: poynter-gothic-text, sans-serif;
    font-style: normal;
    font-weight: 300;
    position: relative;

    .subPercent {
      color: rgb(104, 104, 104);
      font-family: poynter-gothic-text, serif;
      font-style: normal;
      font-weight: 300;
      font-size: 20px;

      .offTarget {
        font-style: italic;
      }
    }
  }
}

@media screen and (max-width: 1120px) {
  #pieCont::after {
    opacity: 0;
  }
}



#pieCont {
  width: 20em;
  height: 20em;
  display: block;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 15px;
  margin: 0 auto;
>>>>>>> 1a29e0a... poop

  .balltop {
    margin: 60px 0 10px;
  }

<<<<<<< HEAD
  .ball {
    width: 11vw;
    height: 11vw;
    border-radius: 50%;
    font-family: Roboto;
    background: $sub;
    margin: auto;
=======
  &::after {
    content: "";
    z-index: 0;
    width: 12px;
    height: 28px;
    background: $accent2;
>>>>>>> 1a29e0a... poop
    display: block;
    color: $red;
    text-align: center;
    line-height: 11vw;
    font-size: 3vw;
  }
  
  .yescampus {
    color: $green;
  }
}
</style>