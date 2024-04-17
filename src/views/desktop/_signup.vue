<template>
  <z-content class="page-auth">
    <div class="auth-box">
      <div>
        <h3 class="title" v-text="$t('page.auth.sign_up')" />
        <form autocomplete="off" @submit.prevent="register">
          <auth-input
            v-model="email"
            name="email"
            :placeholder="$t('page.global.placeholder.email')"
            :placeholder-need="true"
            :error="email_error"
          />
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
          <auth-input
            v-model="refid"
            name="refid"
            :placeholder="$t('page.global.placeholder.refid')"
            :error="refid_error"
          />
          <z-recaptcha @verify="on_captcha_verifed" @expired="on_captcha_expired" />
          <auth-button
            type="submit"
            :loading="auth_loading"
            :disabled="button_disabled"
          >
            {{ $t("page.global.action.sign_up") }}
          </auth-button>
        </form>
      </div>
    </div>
  </z-content>
</template>

<script lang="ts">
import { Mixins, Component } from "vue-property-decorator";
import { UserController } from "@/controllers";
import { AuthMixin } from "@/mixins";

@Component({
  components: {
    "auth-input": () => import("@/components/desktop/auth-input.vue"),
    "auth-button": () => import("@/components/desktop/auth-button.vue")
  }
})
export default class SignUp extends Mixins(AuthMixin) {
  email = "";
  password = "";
  confirm_password = "";
  refid = "";

  button_rules = ["auth_loading", "email", "password", "confirm_password", "refid", "captcha"];

  mounted() {
    if (this.$route.query.refid) this.refid = this.$route.query.refid as string;
  }

  async register() {
    if (this.auth_loading) return;

    await UserController.register({
      email: this.email,
      password: this.password,
      refid: this.refid,
      captcha_response: this.captcha_response,
    });
  }
}
</script>

<style lang="less">
@import "~@/assets/css/views/desktop/auth";
</style>
