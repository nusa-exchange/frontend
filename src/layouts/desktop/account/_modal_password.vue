<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="password-modal"
    :footer="null"
    :width="400"
  >
    <need-security
      v-if="!UserController.otp"
      @change-modal="changeModal"
      @close-modal="closeModal"
    />
    <div v-else-if="UserController.otp && step === 1">
      <img src="@/assets/img/example_modal_logo.jpg" class="logo-modal" />
      <div class="title">
        {{ translation("steps.1.title") }}
      </div>
      <div class="desc">
        {{ translation("steps.1.desc") }}
      </div>
      <form @submit.prevent="step++">
        <auth-input
          v-model="old_password"
          name="old_password"
          type="password"
          placeholder="Old Password"
          :placeholder-need="true"
          :error="old_password_error"
        />
        <auth-input
          v-model="new_password"
          name="new_password"
          type="password"
          placeholder="New Password"
          :placeholder-need="true"
          :error="new_password_error"
        />
        <auth-input
          v-model="confirm_password"
          name="confirm_password"
          type="password"
          placeholder="Confirm Password"
          :placeholder-need="true"
          :error="confirm_password_error"
        />
        <auth-button type="submit" :disabled="button_disabled">
          {{ $t("page.global.action.save") }}
        </auth-button>
      </form>
    </div>
    <div v-else-if="UserController.otp && step === 2">
      <span class="back" @click="step--">
        <a-icon type="left" />
      </span>
      <img src="@/assets/img/example_modal_logo.jpg" class="logo-modal" />
      <div class="title">
        {{ translation("steps.2.title") }}
      </div>
      <div class="desc">
        {{ translation("steps.2.desc") }}
      </div>
      <form @submit.prevent="change_password">
        <auth-input
          v-model="otp_code"
          name="otp_code"
          :placeholder="$t('page.global.placeholder.2fa_code')"
          :placeholder-need="true"
          maxlength="6"
          type="number"
        />
        <auth-button
          type="submit"
          :loading="submit_loading"
          :disabled="!(otp_code.length === 6)"
        >
          {{ $t("page.global.action.confirm") }}
        </auth-button>
      </form>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import * as helpers from "@/library/z-helpers";
import Helpers from "./helpers";
import ApiClient from "@/library/z-apiclient";
import { runNotice, AuthMixin } from "@/mixins";

@Component({
  components: {
    "auth-input": () => import("@/components/desktop/auth-input.vue"),
    "auth-button": () => import("@/components/desktop/auth-button.vue")
  }
})
export default class App extends Mixins(Helpers, AuthMixin) {
  old_password = "";
  new_password = "";
  confirm_password = "";
  otp_code = "";
  submit_loading = false;
  button_rules = ["submit_loading", "old_password", "new_password", "confirm_password"];

  mounted() {
    this.onCreate();
  }

  onCreate() {
    this.step = 1;
    this.old_password = "";
    this.new_password = "";
    this.confirm_password = "";
    this.otp_code = "";
  }

  async change_password() {
    this.submit_loading = true;
    const { old_password, new_password, confirm_password, otp_code } = this;
    try {
      await new ApiClient("auth").put("resource/users/password", {
        old_password,
        new_password,
        confirm_password,
        otp_code
      });
      this.delete();
      runNotice("success", "password.changed");
    } catch (error) {
      return error;
    } finally {
      this.submit_loading = false;
    }
  }

  translation(message, data = {}) {
    return helpers.translation("modal.password." + message, data);
  }

  @Watch("step")
  onStepChanged(step: number) {
    if (step == 1) {
      this.button_rules = ["submit_loading", "old_password", "new_password", "confirm_password"];
    } else {
      this.button_rules = ["submit_loading", "otp"];
      runNotice("warning", "password.need2fa");
    }
  }
}
</script>

<style lang="less">
.password-modal {
  .button-back {
    position: absolute;
    top: 24px;
    left: 24px;
    z-index: 10;
    padding: 0;
    color: var(--color-gray);
    font-weight: 700;
    line-height: 1;
    text-decoration: none;
    background: transparent;
    border: 0;
    outline: 0;
    cursor: pointer;
    transition: color 0.3s;
  }
}
</style>
