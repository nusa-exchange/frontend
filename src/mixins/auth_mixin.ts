import { UserController } from '@/controllers';
import * as helpers from "@/library/z-helpers";
import { Component, Vue } from "vue-property-decorator";

@Component
export class AuthMixin extends Vue {
  private _loading = false;

  otp = "";

  // default auth
  email = "";
  password = ""
  confirm_password = "";
  refid = "";

  // change password
  old_password = "";
  new_password = "";

  button_rules: string[] = [];

  captcha_response = "";

  get auth_loading() {
    return this._loading || UserController.state == "loading";
  }

  set auth_loading(loading: boolean) {
    this._loading = loading;
  }

  get email_error() {
    const { email } = this;

    if (email.length && !helpers.validEmail(email)) {
      return this.$t("page.global.input.error.email");
    }
  }

  get password_error() {
    return this.valid_password(this.password);
  }

  get confirm_password_error() {
    const { password, new_password, confirm_password } = this;

    if (confirm_password.length && confirm_password !== (password.length ? password : new_password)) {
      return this.$t("page.global.input.error.confirm_password");
    }
  }

  get refid_error() {
    const { refid } = this;

    if (refid.length) {
      if (!/^ID\w{10}$/g.test(refid)) return this.$t("page.global.input.error.refid");
    }
  }

  get old_password_error() {
    return this.valid_password(this.old_password);
  }

  get new_password_error() {
    return this.valid_password(this.new_password);;
  }

  get otp_error() {
    const { otp } = this;

    if (otp.length && otp.length !== 6) {
      return this.$t("page.global.input.error.otp");
    }
  }

  get button_disabled() {
    return this.button_rules.map(rule => {
      if (rule.includes("loading")) return this[rule];
      if (rule === "otp") return this.otp.length === 6;
      if (rule == "captcha") return this.captcha_response.length == 0;
      if (rule == "refid") {
        if (this.refid) return !!this.refid_error;
        return false;
      }
      return !(!!(this[rule] as string).length && !this[`${rule}_error`]);
    }).reduce((a, b) => a || b, false);
  }

  valid_password(password: string) {
    if (password.length && !helpers.validPassword(password)) {
      return this.$t("page.global.input.error.password");
    }
  }

  on_captcha_verifed(captcha_response: string) {
    this.captcha_response = captcha_response;
  }

  on_captcha_expired() {
    this.captcha_response = "";
  }
}
