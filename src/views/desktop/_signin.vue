<template>
  <z-content class="page-auth">
    <div class="auth-box">
      <div>
        <h3 class="title" v-text="$t('page.auth.sign_in')" />
        <form @submit.prevent="login()">
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
          <z-recaptcha @verify="on_captcha_verifed" @expired="on_captcha_expired" />
          <auth-button type="submit" :loading="auth_loading" :disabled="button_disabled">
            {{ $t("page.global.action.login") }}
          </auth-button>
          <div>
            <router-link to="forgotpassword" class="forgot">
              {{ $t("page.auth.sign_in.forgot_password") }}
            </router-link>
            <div class="text-right signup">
              {{ $t("page.auth.sign_in.no_account") }}
              <router-link to="signup" v-text="$t('page.auth.sign_in.to_sign_up')" />
            </div>
          </div>
        </form>
      </div>
    </div>
    <modal-totp
      ref="modal-totp"
      :loading="auth_loading"
      @submit="onSubmitTotp"
      @close="modalClose"
    />
  </z-content>
</template>

<script lang="ts">
import { Mixins, Component, Watch } from "vue-property-decorator";
import ModalTotp from "@/layouts/desktop/modal/_modal_totp.vue";
import { LoginMixin } from "@/mixins/page";

@Component({
  components: {
    "auth-input": () => import("@/components/desktop/auth-input.vue"),
    "auth-button": () => import("@/components/desktop/auth-button.vue"),
    "modal-totp": ModalTotp,
  }
})
export default class SignIn extends Mixins(LoginMixin) {
  public $refs!: {
    "modal-totp": ModalTotp;
  };

  url_callback = "/";

  modalClose() {
    this.need2fa = false;
  }

  openTotp() {
    this.$refs["modal-totp"].create();
  }

  @Watch("need2fa")
  onNeed2FAChange(need2fa: boolean) {
    if (need2fa) {
      this.openTotp();
    }
  }
}
</script>

<style lang="less">
@import "~@/assets/css/views/desktop/auth";
</style>
