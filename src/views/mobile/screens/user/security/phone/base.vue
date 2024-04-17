<template>
  <panel-view class="security-phone-screen">
    <head-bar title="Bind Phone Number" @back="destroy" />
    <div class="security-phone-screen-content">
      <auth-input
        class="phone-number-input"
        v-model="suffix_phone_number"
        name="phone_number"
        type="text"
        title="SMS Verification"
        placeholder="Phone number"
      >
        <template slot="prefix">
          <auth-input-prefix @click="open_search('search-country-code')">
            <span class="dial-code">
              +{{ prefix_phone_number }}
            </span>

            <a-icon type="caret-down" />
          </auth-input-prefix>
        </template>
      </auth-input>
      <auth-input
        v-model="code"
        name="code"
        type="text"
        title="SMS Verification Code"
        placeholder="Enter the verification code"
      >
        <template slot="suffix">
          <auth-input-suffix
            :is-action="true"
            :disabled="!suffix_phone_number.length"
            @click="doSend"
          >
            Send
          </auth-input-suffix>
        </template>
      </auth-input>

      <auth-button
        :disabled="code.length != 5"
        @click="verifyCode"
      >
        Active
      </auth-button>
    </div>

    <search-country-code-screen
      ref="search-country-code-screen"
      @click="dial_code => (prefix_phone_number = dial_code)"
    />
  </panel-view>
</template>

<script lang="ts">
import { ConfirmationMixin, runNotice } from "@/mixins";
import { ScreenMixin } from "@/mixins/mobile";
import ApiClient from "@/library/z-apiclient";
import { Component, Mixins } from "vue-property-decorator";
import phone from "phone";

@Component({
  components: {
    "auth-input": () => import("@/components/mobile/auth-input"),
    "auth-input-prefix": () =>
      import("@/components/mobile/auth-input/prefix.vue"),
    "auth-input-suffix": () =>
      import("@/components/mobile/auth-input/suffix.vue"),
    "auth-button": () => import("@/components/mobile/auth-button"),
    "search-country-code-screen": () => import("./search.vue")
  }
})
export default class SecurityPhoneScreen extends Mixins(ScreenMixin, ConfirmationMixin) {
  $refs!: {
    [key: string]: any;
  };

  loading = false;
  prefix_phone_number = "84";
  suffix_phone_number = "";
  code = "";

  get phone_number() {
    return this.prefix_phone_number + this.suffix_phone_number;
  }

  get phone_number_error() {
    const { phone_number } = this;
    if (!phone_number.length) {
      return false;
    }

    if (!phone("+" + phone_number).length) {
      return "Phone error";
    }
  }

  before_panel_create() {
    if (this.UserController.phone?.number) {
      const number = this.UserController.phone?.number;
      this.prefix_phone_number = number.slice(0, 2);
      this.suffix_phone_number = number.slice(2, number.length)
    }
  }

  async sendCode() {
    this.loading = true;
    try {
      await new ApiClient("auth").post("resource/phones", {
        phone_number: this.phone_number
      });
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
      await new ApiClient("auth").post("resource/phones/send_code");
      runNotice("success", "phone.verification.send");
      this.start_cooldown();
    } catch (error) {
      return error;
    } finally {
      this.loading_resend = false;
    }
  }

  doSend() {
    if (this.phone_number.includes("*")) {
      this.reSendCode();
    } else {
      if (this.suffix_phone_number.length == 0) return;

      this.sendCode();
    }
  }

  async verifyCode() {
    this.loading = true;
    try {
      await new ApiClient("auth").post("resource/phones/verify", { verification_code: this.code });
      runNotice("success", "phone.confirmed");
      this.destroy();
    } catch (error) {
      return error;
    } finally {
      this.loading = false;
    }
  }

  open_search(screen: string) {
    this.$refs[`${screen}-screen`].create();
  }
}
</script>

<style lang="less">
.security-phone-screen {
  background-color: var(--bg-card-color);

  &-content {
    position: relative;
    height: calc(100% - 35px);
    padding: 12px 16px;

    > * {
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .phone-number-input {
      .z-auth-input-prefix {
        display: flex;

        .dial-code {
          color: var(--text-default-color);
          font-size: 10px;
        }

        i {
          margin-left: 4px;
          line-height: 35px;
          font-size: 8px;
        }
      }
    }

    .z-auth-button {
      margin-top: 12px;
    }
  }
}
</style>
