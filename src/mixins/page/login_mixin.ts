import { UserController } from "@/controllers";
import { AuthMixin } from "@/mixins";
import { Component, Mixins } from "vue-property-decorator";

@Component
export class LoginMixin extends Mixins(AuthMixin) {
  url_callback = "";
  button_rules = ["auth_loading", "email", "password", "captcha"];

  get need2fa() {
    return UserController.need2fa;
  }

  set need2fa(need2fa) {
    UserController.need2fa = need2fa;
  }

  onSubmitTotp(totp_code) {
    this.otp = totp_code;
    this.login();
  }

  async callLogin() {
    if (this.auth_loading) return;

    await UserController.login(
      {
        email: this.email,
        password: this.password,
        otp_code: this.otp,
        captcha_response: this.captcha_response
      },
      this.url_callback
    );
  }

  login() {
    if (this.auth_loading) return;

    if (this.need2fa) {
      if (this.otp.length >= 6) {
        this.callLogin();
      }
    } else {
      this.callLogin();
    }
  }
}
