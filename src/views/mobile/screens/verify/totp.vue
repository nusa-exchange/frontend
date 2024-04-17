<template>
  <panel-view class="screen-verify screen-verify-otp verify-otp">
    <head-bar @back="$emit('cancel')" />

    <form class="screen-verify-box" @submit.prevent="onSubmit">
      <div class="screen-auth-title">
        Security Verification
      </div>
      <auth-input
        v-model="otp_code"
        name="otp_code"
        type="number"
        maxlength="6"
        placeholder="Google verification code"
      />

      <auth-button type="submit" :loading="loading" :disabled="button_disabled">
        Confirm
      </auth-button>
    </form>
  </panel-view>
</template>

<script lang="ts">
import VerifyMixin from "./mixin";
import { ScreenMixin } from "@/mixins/mobile";
import { Mixins, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class VerifyOTPScreen extends Mixins(ScreenMixin, VerifyMixin) {
  @Prop() private readonly loading!: boolean;

  otp_code = "";

  get button_disabled() {
    return !(this.otp_code.length === 6) || this.loading;
  }

  panel_created() {
    this.otp_code = "";
  }

  onSubmit() {
    if (this.button_disabled) return;

    this.$emit("submit", this.otp_code);
  }

  @Watch("otp_code")
  onOTPCodeChanged(otp_code: string) {
    if (otp_code.length === 6) {
      this.onSubmit();
    }
  }
}
</script>

<style lang="less">
@import "~@/assets/css/screens/auth";

.verify-otp {
  &-box {
  }

  &-action {
  }
}
</style>
