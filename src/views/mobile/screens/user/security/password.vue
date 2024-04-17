<template>
  <panel-view class="security-password-screen">
    <head-bar title="Change Password" @back="destroy" />
    <form
      class="security-password-screen-content"
      @submit.prevent="change_password"
    >
      <auth-input
        v-model="old_password"
        name="old_password"
        type="password"
        title="Old Password"
        placeholder="Please enter the old password"
        :error="old_password_error"
      />
      <auth-input
        v-model="new_password"
        name="new_password"
        type="password"
        title="New Password"
        placeholder="New Password"
        :error="new_password_error"
      />
      <auth-input
        v-model="confirm_password"
        name="confirm_password"
        type="password"
        title="Confirm Password"
        placeholder="Confirm Password"
        :error="confirm_password_error"
      />

      <auth-button type="submit" :loading="loading" :disabled="button_disabled">
        Change
      </auth-button>
    </form>
  </panel-view>
</template>

<script lang="ts">
import { AuthMixin } from "@/mixins";
import { ScreenMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";
import { UserController } from "@/controllers";

@Component({
  components: {
    "auth-input": () => import("@/components/mobile/auth-input"),
    "auth-button": () => import("@/components/mobile/auth-button")
  }
})
export default class SecurityPasswordScreen extends Mixins(
  ScreenMixin,
  AuthMixin
) {
  loading = false;
  button_rules = [
    "old_password",
    "new_password",
    "confirm_password",
    "loading"
  ];
  old_password = "";
  new_password = "";
  confirm_password = "";

  async change_password() {
    this.loading = true;

    await UserController.change_password(
      this.old_password,
      this.new_password,
      this.confirm_password,
      () => {
        this.destroy();
      }
    );

    this.loading = false;
  }
}
</script>

<style lang="less">
.security-password-screen {
  background-color: var(--bg-card-color);

  &-content {
    margin: 24px 24px;

    > * {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
