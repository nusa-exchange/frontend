<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="phone-modal"
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
    <div v-if="step === 1">
      <img src="@/assets/img/example_modal_logo.jpg" class="logo-modal" />
      <div class="title">
        {{ translation("steps.1.title") }}
      </div>
      <div class="desc">
        {{ translation("steps.1.desc") }}
      </div>
      <form @submit.prevent="sendCode">
        <div class="phone-number">
          <auth-input
            v-model="phone_number"
            name="phone_number"
            prefix="+"
            placeholder="Phone number"
            :placeholder-need="true"
            :error="phone_number_error"
            type="number"
          />
        </div>
        <auth-button
          type="submit"
          :loading="loading"
          :disabled="button_disabled"
        >
          {{ $t("page.global.action.send_code") }}
        </auth-button>
      </form>
    </div>
    <div v-else>
      <img src="@/assets/img/example_modal_logo.jpg" class="logo-modal" />
      <div class="title">
        {{ translation("steps.2.title") }}
      </div>
      <div class="desc">
        {{ translation("steps.2.desc", { phone_number: phone_number }) }}
      </div>
      <form @submit.prevent="verifyCode">
        <auth-input
          v-model="verification_code"
          name="verification_code"
          placeholder="Verification code"
          :placeholder-need="true"
          type="number"
          maxlength="6"
        >
          <template slot="right-action">
            <button
              style="padding: 0px 6px;font-weight: 500;line-height: 24px;height: 24px;"
              :disabled="this.cooldown > 0"
              @click.prevent="reSendCode"
            >
              <span v-if="this.loading_resend">
                {{ $t("page.global.action.sending") }}
              </span>
              <span v-else>{{ this.cooldown ? "Resend" : "Send Code" }}</span>
              <span v-if="cooldown">({{ cooldown }})</span>
            </button>
          </template>
        </auth-input>
        <auth-button type="submit" :loading="loading" :disabled="button_disabled">
          {{ $t("page.global.action.confirm") }}
        </auth-button>
      </form>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import ApiClient from "@/library/z-apiclient";
import * as helpers from "@/library/z-helpers";
import Helpers from "./helpers";
import phone from "phone";
import { UserController } from "@/controllers";
import { ConfirmationMixin, runNotice } from "@/mixins";

@Component({
  components: {
    "auth-input": () => import("@/components/desktop/auth-input.vue"),
    "auth-button": () => import("@/components/desktop/auth-button.vue")
  }
})
export default class App extends Mixins(Helpers, ConfirmationMixin) {
  loading = false;
  phone_number = "";
  verification_code = "";

  get phone_number_error() {
    const { phone_number } = this;
    if (!phone_number.length) {
      return false;
    }

    if (!phone("+" + phone_number).length) {
      return "Phone error";
    }
  }

  get button_disabled() {
    if (this.step === 1) {
      const { phone_number } = this;
      const { phone_number_error } = this;

      const rule_1 = phone_number.length;
      const rule_2 = !phone_number_error;
      const allow = rule_1 && rule_2;

      return !allow;
    } else {
      const { verification_code } = this;

      const rule_1 = verification_code.length === 6;
      const allow = rule_1;

      return !allow;
    }
  }

  onCreate() {
    this.step = 1;
    if (UserController.phone?.number) {
      this.step++;
    }
    this.verification_code = "";
  }

  async sendCode() {
    this.loading = true;
    try {
      await new ApiClient("auth").post("resource/phones", {
        phone_number: this.phone_number
      });
      this.step++;
      runNotice("success", "phone.verification.send");
    } catch (error) {
      return error;
    } finally {
      this.loading = false;
    }
  }

  async reSendCode() {
    this.loading_resend = true;
    try {
      await new ApiClient("auth").post("resource/phones");
      runNotice("success", "phone.verification.send");
      this.start_cooldown();
    } catch (error) {
      return error;
    } finally {
      this.loading_resend = false;
    }
  }

  async verifyCode() {
    this.loading = true;
    try {
      await new ApiClient("auth").post("resource/phones/verify", { verification_code: this.verification_code });
      runNotice("success", "phone.confirmed");
      this.delete();
    } catch (error) {
      return error;
    } finally {
      this.loading = false;
    }
  }

  translation(message, data = {}) {
    return helpers.translation("modal.phone." + message, data);
  }
}
</script>
