<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="2fa-modal"
    :footer="null"
    :width="400"
  >
    <button
      v-show="step > 1"
      type="button"
      aria-label="Action"
      class="ant-modal-action"
      @click="step--"
    >
      <span class="ant-modal-action-x">
        <i class="zicon-arrow-back" />
      </span>
    </button>
    <img src="@/assets/img/Google_Authenticator.png" class="logo-modal" />
    <div v-if="step === 1" class="step">
      <div
        class="desc"
        v-text="translation('steps.1.desc')"
      />
    </div>
    <div v-else-if="step === 2" class="step">
      <div
        class="title"
        v-text="translation('steps.2.title')"
      />
      <div class="box">
        <qrcode :value="code.url" :size="110" level="L" />
        <div class="info-qr">
          <p
            class="info"
            v-text="translation('steps.2.info')"
          />
          <p class="secret">
            {{ translation('steps.2.key') }}: {{ code.secret }}
          </p>
        </div>
      </div>
    </div>
    <div v-else-if="step === 3" class="step">
      <div
        class="title"
        v-text="translation('steps.3.title')"
      />
      <div
        class="desc"
        v-text="translation('steps.3.desc')"
      />
      <form @submit.prevent="enable2FA">
        <auth-input
          v-model="password"
          name="password"
          type="password"
          :placeholder="$t('page.global.placeholder.password')"
          :placeholder-need="true"
        />
        <auth-input
          v-model="otp_code"
          name="otp_code"
          type="number"
          :placeholder="$t('page.global.placeholder.2fa_code')"
          :placeholder-need="true"
          maxlength="6"
        />
        <auth-button
          type="submit"
          :loading="loading"
          :disabled="button_disabled"
        >
          {{ $t("page.global.action.confirm") }}
        </auth-button>
      </form>
    </div>
    <auth-button v-if="step < 3" @click="step++" v-text="$t('page.global.action.next')" />
    <div v-if="step === 2" class="later-footer">
      <span @click="modal.enabled = false" v-text="$t('page.global.action.later')" />
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import * as helpers from "@/library/z-helpers";
import ApiClient from "@/library/z-apiclient";
import Helpers from "./helpers";
import UserController from "@/controllers/user";

@Component({
  components: {
    qrcode: () => import("@/components/desktop/qrcode"),
    "auth-input": () => import("@/components/desktop/auth-input.vue"),
    "auth-button": () => import("@/components/desktop/auth-button.vue")
  }
})
export default class App extends Mixins(Helpers) {
  loading = false;
  step = 1;
  otp_code = "";
  password = "";
  code = {
    secret: "",
    url: ""
  };

  get button_disabled() {
    if (this.step === 3) {
      const { otp_code, password } = this;

      const allow = otp_code.length === 6 && password.length;

      return !allow;
    }

    return false;
  }

  public onCreate() {
    this.step = 1;
    this.otp_code = "";
    this.password = "";
    if (!this.code.secret) {
      this.getQRCode();
    }
  }

  public async getQRCode() {
    try {
      const { data } = await new ApiClient("auth").post(
        "resource/otp/generate_qrcode"
      );
      let url = data.data.url;
      url = helpers.removeURLParam(url, "algorithm");
      url = helpers.removeURLParam(url, "digits");
      this.code = {
        secret: helpers.getURLParam(url, "secret"),
        url
      };
    } catch (error) {
      return error;
    }
  }

  async enable2FA() {
    this.loading = true;
    const { password, otp_code } = this;
    await UserController.enable_2fa(password, otp_code);
    this.loading = false;

    if (UserController.otp) {
      this.$emit("success");
      this.delete();
    } else {
      this.$emit("failed");
    }
  }

  translation(message, data = {}) {
    return helpers.translation("modal.2fa." + message, data);
  }
}
</script>
