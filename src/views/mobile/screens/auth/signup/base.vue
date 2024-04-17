<template>
  <panel-view class="screen-auth">
    <head-bar :left-disabled="true">
      <template v-slot:right>
        <div class="right-action">
          <i class="zicon-close" @click="destroy" />
        </div>
      </template>
    </head-bar>
    <div class="body-bar">
      <form class="screen-auth-box" @submit.prevent="register">
        <div class="screen-auth-logo" />
        <div class="screen-auth-title">Sign Up</div>

        <auth-input
          v-model="email"
          name="email"
          type="text"
          placeholder="Email"
          :error="email_error"
        />
        <auth-input
          v-model="password"
          name="password"
          type="password"
          placeholder="Password"
          :error="password_error"
        />
        <auth-input
          v-model="confirm_password"
          name="confirm_password"
          type="password"
          placeholder="Confirm password"
          :error="confirm_password_error"
        />
        <auth-input
          v-model="refid"
          name="refid"
          type="text"
          placeholder="Referral UID"
          :error="refid_error"
        />
        <z-recaptcha @verify="on_captcha_verifed" @expired="on_captcha_expired" />
        <auth-button
          type="submit"
          :loading="auth_loading"
          :disabled="button_disabled"
        >
          Sign Up
        </auth-button>

        <div class="screen-auth-action">
          <p class="screen-auth-action-item">
            Already have an account? <a @click="destroy">Login</a>
          </p>
        </div>
      </form>
    </div>
  </panel-view>
</template>

<script lang="ts">
import { AuthMixin } from "@/mixins";
import { ScreenMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";
import ZSmartModel from "@/library/z-eventbus";

@Component({
  components: {
    "auth-input": () => import("@/components/mobile/auth-input"),
    "auth-button": () => import("@/components/mobile/auth-button"),
  },
})
export default class SignUpScreen extends Mixins(ScreenMixin, AuthMixin) {
  email = "";
  password = "";
  confirm_password = "";
  refid = "";

  button_rules = ["auth_loading", "email", "password", "confirm_password", "captcha"];

  before_panel_create() {
    ZSmartModel.on("user/WAIT_EMAIL", () => {
      this.destroy();
    });
  }

  beforeDestroy() {
    ZSmartModel.remove("user/WAIT_EMAIL", () => {
      this.destroy();
    });
  }

  async register() {
    if (this.auth_loading) return;

    await this.UserController.register({
      email: this.email,
      password: this.password,
      refid: this.refid,
      captcha_response: this.captcha_response,
    });
  }
}
</script>

<style lang="less">
@import "~@/assets/css/screens/auth";
</style>
