<template>
  <z-content class="page-auth forgot-password">
    <div class="auth-box">
      <div v-if="step == 1">
        <form @submit.prevent="forgot_password">
          <a-steps :current="step - 1" size="small">
            <a-step :title="$t('page.auth.forgot_password.steps.1.step')" />
            <a-step :title="$t('page.auth.forgot_password.steps.2.step')" />
            <a-step :title="$t('page.auth.forgot_password.steps.3.step')" />
          </a-steps>
          <h3 class="title" v-text="$t('page.auth.forgot_password')" />
          <auth-input
            v-model="email"
            name="email"
            :placeholder="$t('page.global.placeholder.email')"
            :placeholder-need="true"
            :error="email_error"
          />
          <z-recaptcha @verify="on_captcha_verifed" @expired="on_captcha_expired" />
          <auth-button
            type="submit"
            :loading="loading"
            :disabled="!email || email_error"
          >
            {{ $t("page.global.action.forgot_password") }}
          </auth-button>
        </form>
      </div>
      <div v-else-if="step == 2">
        <form @submit.prevent="check_token">
          <a-steps :current="step - 1" size="small">
            <a-step :title="$t('page.auth.forgot_password.steps.1.step')" />
            <a-step :title="$t('page.auth.forgot_password.steps.2.step')" />
            <a-step :title="$t('page.auth.forgot_password.steps.3.step')" />
          </a-steps>
          <h3 class="title">{{ $t('page.auth.forgot_password.steps.2.title') }}</h3>
          <div class="desc">
            {{ $t('page.auth.forgot_password.steps.2.desc') }}
          </div>

          <auth-input
            v-model="confirmation_code"
            name="confirmation_code"
            :placeholder="$t('page.global.placeholder.e-confirmation_code')"
            :placeholder-need="true"
          >
            <template slot="right-action">
              <button :disabled="cooldown > 0" @click.prevent="forgot_password">
                <span>{{ this.cooldown ? $t("page.global.action.resend") : $t("page.global.action.send_code") }}</span>
                <span v-if="cooldown">({{ cooldown }})</span>
              </button>
            </template>
          </auth-input>

          <auth-button
            type="submit"
            :loading="loading"
            :disabled="confirmation_code.length < 6"
          >
            {{ $t("page.global.action.submit") }}
          </auth-button>
        </form>
      </div>
      <div v-else>
        <form @submit.prevent="reset_password">
          <a-steps :current="step - 1" size="small">
            <a-step :title="$t('page.auth.forgot_password.steps.1.step')" />
            <a-step :title="$t('page.auth.forgot_password.steps.2.step')" />
            <a-step :title="$t('page.auth.forgot_password.steps.3.step')" />
          </a-steps>
          <h3 class="title">{{ $t('page.auth.forgot_password.steps.3.title') }}</h3>

          <auth-input
            v-model="password"
            name="password"
            type="password"
            :placeholder="$t('page.global.placeholder.password')"
            :placeholder-need="true"
            :error="password_error"
          />
          <auth-input
            v-model="confirm_password"
            name="confirm_password"
            type="password"
            :placeholder="$t('page.global.placeholder.confirm_password')"
            :placeholder-need="true"
            :error="confirm_password_error"
          />
          <auth-button
            type="submit"
            :loading="loading"
            :disabled="password_error || confirm_password_error"
          >
            {{ $t("page.global.action.reset_password") }}
          </auth-button>
        </form>
      </div>
    </div>
  </z-content>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { ConfirmationMixin, AuthMixin } from "@/mixins";
import { UserController } from "@/controllers";

@Component({
  components: {
    "auth-input": () => import("@/components/desktop/auth-input.vue"),
    "auth-button": () => import("@/components/desktop/auth-button.vue")
  }
})
export default class ForgotPassword extends Mixins(ConfirmationMixin, AuthMixin) {
  step = 1;
  loading = false;
  sended = false;

  email = "";
  password = "";
  confirm_password = "";
  button_rules = ["loading", "email", "captcha"];

  async forgot_password() {
    this.loading = true;

    await UserController.forgot_password(
      {
        email: this.email,
        captcha_response: this.captcha_response
      },
      () => {
        this.start_cooldown();
        this.step = 2;
      }
    );

    this.loading = false;
  }

  async check_token() {
    this.loading = true;
    await UserController.check_code_reset_password(
      this.email,
      this.confirmation_code,
      () => {
        this.step++;
        this.button_rules = ["loading", "password", "confirm_password"];
      }
    );
    this.loading = false;
  }

  async reset_password() {
    this.loading = true;
    await UserController.confirm_reset_password(
      this.email,
      this.confirmation_code,
      this.password,
      this.confirm_password,
      () => {
        this.$router.push("/signin");
      }
    );
    this.loading = false;
  }
}
</script>

<style lang="less">
@import "~@/assets/css/views/desktop/auth";

.forgot-password {
  .ant-steps {
    margin-bottom: 20px;
  }
}
</style>
