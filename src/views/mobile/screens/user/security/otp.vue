<template>
  <panel-view class="security-otp-screen">
    <head-bar title="Setting Google Verification" @back="destroy" />
    <div class="security-otp-screen-content">
      <z-step :steps="STEP" :value="step" />

      <template v-if="step === 1">
        <div class="note-step">
          <div class="note-step-content">
            Step 1: Please download and install the Google Authenticator. If you
            have already installed , please go to the next step.
          </div>

          <div class="note-step-icon">
            <img src="@/assets/img/Google_Authenticator.png" />
          </div>

          <button class="note-step-button bg-up text-up">
            Download Google Authenticator
          </button>
          <button
            class="note-step-button"
            style="font-size: 11px; background-color: transparent; color: var(--color-gray);"
          >
            From Google Play
          </button>
        </div>
      </template>
      <template v-if="step === 2">
        <div class="note-step">
          <div class="note-step-content">
            Step 2: Please scan the QR code or copy the private key to Google
            Authenticator.
          </div>

          <div class="note-step-icon qrcode">
            <div class="qrcode-image">
              <qrcode :value="code.url" :size="110" level="L" />
            </div>
            <div class="qrcode-content"></div>
          </div>

          <button class="note-step-button" @click="copy_secret">
            Copy Private Key
          </button>

          <div class="note-step-warn">
            Please backup your 2-FA private key by saving on paper and portable
            note device.
          </div>
        </div>
      </template>
      <template v-if="step === 3">
        <auth-input
          v-model="password"
          name="password"
          type="password"
          title="Your password"
          placeholder="Enter your password"
        />
        <auth-input
          v-model="otp_code"
          name="otp_code"
          type="number"
          maxlength="6"
          title="Google verification code"
          placeholder="Enter the verification code"
        />
      </template>

      <button v-if="step < 3" class="button-next" type="submit" @click="step++">
        {{ button_content }}
      </button>
      <auth-button
        v-else
        type="submit"
        :loading="loading"
        :disabled="otp_code.length < 6"
        @click="enable_2fa"
      >
        {{ button_content }}
      </auth-button>
    </div>
  </panel-view>
</template>

<script lang="ts">
import * as helpers from "@/library/z-helpers";
import UserController from "@/controllers/user";
import { ScreenMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";
import { runNotice } from "@/mixins";

@Component({
  components: {
    qrcode: () => import("@/components/desktop/qrcode"),
    "auth-input": () => import("@/components/mobile/auth-input"),
    "auth-button": () => import("@/components/mobile/auth-button"),
    "z-step": () => import("@/components/mobile/z-step.vue")
  }
})
export default class SecurityOTPScreen extends Mixins(ScreenMixin) {
  loading = false;
  step = 1;
  password = "";
  otp_code = "";
  code = {
    secret: "",
    url: ""
  };

  get STEP() {
    return [
      {
        text: "Download APP",
        done: this.step == 1
      },
      {
        text: "Copy Private Key",
        done: this.step == 2
      },
      {
        text: "Enable Google Verification",
        done: this.step == 3
      }
    ];
  }

  get button_content() {
    if (this.step === 1) return "Already installed, continue";
    if (this.step === 2) return "Next";
    if (this.step === 3) return "Active";
  }

  onSubmit() {
    if (this.step === 3) {
      //
    }
  }

  before_panel_create() {
    this.get_qrcode();
  }

  before_panel_destroy() {
    this.step = 1;
  }

  async get_qrcode() {
    const qrcode = await UserController.get_qrcode();
    if (!qrcode) return;

    let url = qrcode.url;
    url = helpers.removeURLParam(url, "algorithm");
    url = helpers.removeURLParam(url, "digits");
    this.code = {
      secret: helpers.getURLParam(url, "secret"),
      url
    };
  }

  copy_secret() {
    helpers.copyText(this.code.secret);
    runNotice("success", "copy");
  }

  async enable_2fa() {
    this.loading = true;

    await UserController.enable_2fa(this.password, this.otp_code, () => {
      this.destroy();
    });

    this.loading = false;
  }
}
</script>

<style lang="less">
.security-otp-screen {
  background-color: var(--bg-card-color);

  &-content {
    position: relative;
    height: calc(100% - 35px);
    padding: 12px 16px;
    text-align: center;

    .z-step {
      margin: 0 -16px 40px;
    }

    .note-step {
      padding: 0 16px;
      font-size: 14px;

      &-icon {
        display: inline-block;
        margin: 24px;
        padding: 8px;
        background-color: white;
        border-radius: 8px;

        &.qrcode {
          border-radius: 0;
        }

        .qrcode-image {
            canvas {
              vertical-align: middle;
            }
          }

        img {
          width: 50px;
          height: 50px;
        }
      }

      &-content {
      }

      &-warn {
        margin-top: 12px;
        font-size: 11px;
        font-weight: 500;
        color: var(--warning-color);
      }

      &-button {
        height: 30px;
        line-height: 30px;
        font-weight: 500;
        width: 100%;
        background-color: var(--disabled-color);
        color: var(--bg-card-color);
      }
    }

    .button-next {
      position: absolute;
      left: 16px;
      bottom: 12px;

      height: 30px;
      line-height: 30px;
      width: calc(100% - 16px * 2);
      background-color: var(--blue-color);
      color: var(--bg-card-color);
      font-weight: 500;
      font-size: 12px;
    }

    .z-auth-button {
      margin-top: 20px;
    }
  }
}
</style>
