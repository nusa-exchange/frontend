<template>
  <transition name="panel-move">
    <div v-if="showing" class="warning-modal">
      <div @click="remove" class="warning-modal-mark"></div>
      <div class="warning-modal-wrapper">
        <div class="warning-modal-head">
          <div class="warning-modal-close" @click="remove">
            <a-icon type="close" />
          </div>
        </div>
        <div class="warning-modal-content">
          <div class="warning-modal-icon">
            <a-icon type="warning" />
          </div>
          <div class="warning-modal-title">Google Authentication</div>
          <div class="warning-modal-description">
            Google Authentication is required for Deposit and Withdraw, please
            bind
          </div>

          <div class="warning-modal-button">
            <button @click="onpen2FAPage">VERIFY NOW</button>
          </div>
        </div>
      </div>
      <screen-security-otp ref="screen-security-otp" />
    </div>
  </transition>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "screen-security-otp": () => import("@/views/mobile/screens/user/security/otp.vue")
  }
})
export default class WarningModal extends Vue {
  showing = false;

  create() {
    this.showing = true;
  }

  delete() {
    this.showing = false;
  }

  remove() {
    this.delete();
  }

  close() {
    this.delete();
  }

  onpen2FAPage() {
    (this.$refs["screen-security-otp"] as any).create();
  }
}
</script>

<style lang="less">
.panel-move {
  &-enter,
  &-leave-active {
    transform: translate(0, 100%);
  }

  &-enter-active,
  &-leave-active {
    transition: transform 0.3s;
  }
}

.warning-modal {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 999;

  &-mark {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
  }

  &-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding-top: 12px;
    background-color: var(--bg-downdown-color);
    z-index: 999;
    border-radius: 12px 12px 0px 0px;
  }

  &-close {
    text-align: right;
    line-height: 1;
    font-size: 14px;
    margin-top: 12px;
    margin-right: 12px;
  }

  &-content {
    padding-bottom: 25px;
    padding-left: 12px;
    padding-right: 12px;
  }

  &-icon {
    color: var(--warning-color);
    font-size: 50px;
    text-align: center;
    margin-bottom: 12px;
  }

  &-title {
    font-size: 18px;
    text-align: center;
    margin-bottom: 4px;
  }

  &-description {
    text-align: center;
    margin-bottom: 16px;
  }

  &-button {
    text-align: center;
    margin-bottom: 12px;

    button {
      color: var(--blue-color);
      font-size: 11px;
      font-weight: 500;
      height: 25px;
      border-radius: 2px;
      border: 1px solid;
      padding: 0 12px;
    }
  }
}
</style>
