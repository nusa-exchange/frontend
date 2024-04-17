<template>
  <div :class="['page-loading']">
    <div class="spinner">
      <div class="rect1"></div>
      <div class="rect2"></div>
      <div class="rect3"></div>
      <div class="rect4"></div>
    </div>
  </div>
</template>

<style lang="less">
.page-loading {
  position: fixed;
  height: 100vh;
  width: 100vw;
  left: 0;
  top: 0;
  background: #0e182b;
  z-index: 1;
}
.page-loading .spinner {
  margin: auto;
  display: block;
  height: 75px;
  text-align: center;
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
.page-loading .spinner > div {
  background-color: #5b627b;
  height: 100%;
  width: 5px;
  margin: 0 3px;
  border-radius: 50px;
  display: inline-block;
  -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}
.page-loading .spinner .rect2 {
  animation-delay: -1.1s;
}
.page-loading .spinner .rect3 {
  animation-delay: -1s;
}
.page-loading .spinner .rect4 {
  animation-delay: -0.9s;
}
.page-loading .spinner .rect5 {
  animation-delay: -0.8s;
}
@-webkit-keyframes sk-stretchdelay {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
}
@keyframes sk-stretchdelay {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
}
</style>
