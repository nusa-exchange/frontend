<template>
  <div class="page-not-found">
    <div class="objects">
      <img
        class="object_rocket"
        src="@/assets/img/404/rocket.svg"
        width="40px"
      />
      <div class="earth-moon">
        <img
          class="object_earth"
          src="@/assets/img/404/earth.svg"
          width="100px"
        />
        <img class="object_moon" src="@/assets/img/404/moon.svg" width="80px" />
      </div>
      <div class="box_astronaut">
        <img
          class="object_astronaut"
          src="@/assets/img/404/astronaut.svg"
          width="140px"
        />
      </div>
    </div>
    <div class="page-not-content">
      <img src="@/assets/img/404/404.svg" width="300px" />
      <div class="page-not-found-action">
        <a-button type="primary">GO BACK HOME</a-button>
      </div>
    </div>

    <div class="glowing_stars">
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class PageNotFound extends Vue {
  header_class = "ant-layout-header";
  footer_class = "ant-layout-footer";
  loop_set_height!: NodeJS.Timeout;
  $el: HTMLElement;

  mounted() {
    this.loop_set_height = setInterval(() => {
      this.set_content_height();
    }, 100);

    window.addEventListener("resize", this.set_content_height);
  }

  beforeDestroy() {
    clearInterval(this.loop_set_height);
    window.removeEventListener("resize", this.set_content_height);
  }

  set_content_height() {
    const document_height = document.body.clientHeight;
    const header_height = document.querySelector(`.${this.header_class}`)
      .clientHeight;
    const footer_height = document.querySelector(`.${this.footer_class}`)
      .clientHeight;

    this.$el.style.height =
      document_height - header_height - footer_height - 1 + "px";
  }
}
</script>

<style lang="less">
.page-not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;

  background-image: url("~@/assets/img/404/overlay_stars.svg");
  background-repeat: repeat;
  background-size: contain;
  background-position: left top;

  &-content {
    text-align: center;
  }

  &-action {
    text-align: center;
    margin-top: 24px;
  }
}

.objects img {
  z-index: 90;
  pointer-events: none;
}

.object_rocket {
  z-index: 95;
  position: absolute;
  transform: translateX(-50px);
  top: 75%;
  pointer-events: none;
  animation: rocket-movement 200s linear infinite both running;
}

.object_earth {
  position: absolute;
  top: 20%;
  left: 15%;
  z-index: 90;
  /*    animation: spin-earth 100s infinite linear both;*/
}

.object_moon {
  position: absolute;
  top: 12%;
  left: 25%;
  /*
    transform: rotate(0deg);
    transition: transform ease-in 99999999999s;
*/
}

.earth-moon {
}

.object_astronaut {
  animation: rotate-astronaut 200s infinite linear both alternate;
}

.box_astronaut {
  z-index: 110 !important;
  position: absolute;
  top: 60%;
  right: 20%;
  will-change: transform;
  animation: move-astronaut 50s infinite linear both alternate;
}

.glowing_stars .star {
  position: absolute;
  border-radius: 100%;
  background-color: #fff;
  width: 3px;
  height: 3px;
  opacity: 0.3;
  will-change: opacity;
}

.glowing_stars .star:nth-child(1) {
  top: 80%;
  left: 25%;
  animation: glow-star 2s infinite ease-in-out alternate 1s;
}
.glowing_stars .star:nth-child(2) {
  top: 20%;
  left: 40%;
  animation: glow-star 2s infinite ease-in-out alternate 3s;
}
.glowing_stars .star:nth-child(3) {
  top: 25%;
  left: 25%;
  animation: glow-star 2s infinite ease-in-out alternate 5s;
}
.glowing_stars .star:nth-child(4) {
  top: 75%;
  left: 80%;
  animation: glow-star 2s infinite ease-in-out alternate 7s;
}
.glowing_stars .star:nth-child(5) {
  top: 90%;
  left: 50%;
  animation: glow-star 2s infinite ease-in-out alternate 9s;
}

@-moz-keyframes rocket-movement {
  100% {
    -moz-transform: translate(1200px, -600px);
  }
}
@-webkit-keyframes rocket-movement {
  100% {
    -webkit-transform: translate(1200px, -600px);
  }
}
@keyframes rocket-movement {
  100% {
    transform: translate(1200px, -600px);
  }
}
@-moz-keyframes spin-earth {
  100% {
    -moz-transform: rotate(-360deg);
    transition: transform 20s;
  }
}
@-webkit-keyframes spin-earth {
  100% {
    -webkit-transform: rotate(-360deg);
    transition: transform 20s;
  }
}
@keyframes spin-earth {
  100% {
    -webkit-transform: rotate(-360deg);
    transform: rotate(-360deg);
    transition: transform 20s;
  }
}

@-moz-keyframes move-astronaut {
  100% {
    -moz-transform: translate(-160px, -160px);
  }
}
@-webkit-keyframes move-astronaut {
  100% {
    -webkit-transform: translate(-160px, -160px);
  }
}
@keyframes move-astronaut {
  100% {
    -webkit-transform: translate(-160px, -160px);
    transform: translate(-160px, -160px);
  }
}
@-moz-keyframes rotate-astronaut {
  100% {
    -moz-transform: rotate(-720deg);
  }
}
@-webkit-keyframes rotate-astronaut {
  100% {
    -webkit-transform: rotate(-720deg);
  }
}
@keyframes rotate-astronaut {
  100% {
    -webkit-transform: rotate(-720deg);
    transform: rotate(-720deg);
  }
}

@-moz-keyframes glow-star {
  40% {
    -moz-opacity: 0.3;
  }
  90%,
  100% {
    -moz-opacity: 1;
    -moz-transform: scale(1.2);
  }
}
@-webkit-keyframes glow-star {
  40% {
    -webkit-opacity: 0.3;
  }
  90%,
  100% {
    -webkit-opacity: 1;
    -webkit-transform: scale(1.2);
  }
}
@keyframes glow-star {
  40% {
    -webkit-opacity: 0.3;
    opacity: 0.3;
  }
  90%,
  100% {
    -webkit-opacity: 1;
    opacity: 1;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
    border-radius: 999999px;
  }
}
</style>
