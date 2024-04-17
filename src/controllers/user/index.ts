import router from "@/router";
import ApiClient from "@/library/z-apiclient";
import Vue from "vue";
import store from "./store";
import GettersSetters from "./getters_setters";
import { applyMixins } from '../mixins';
import ZSmartModel from "@/library/z-eventbus";
import { IsMobile, runNotice } from "@/mixins";
import { TradeController } from "..";

export class UserController {
  store = store;

  constructor() {
    ZSmartModel.on("user/LOGIN", () => {
      this.keep_session();

      if (this.state == "active") {
        this.get_balance();
      }
    });

    ZSmartModel.on("user/LOGOUT", () => {
      this.auth_error();

      if (IsMobile()) {
        if (router.currentRoute.fullPath != "/m") router.push({ path: "/m" });
      } else {
        if (router.currentRoute.fullPath != "/") router.push({ path: "/" });
      }

      ["open_orders", "orders_history", "trades_history"].forEach(
        async (type: "open_orders" | "orders_history" | "trades_history") => {
          TradeController[type].clear()
        }
      )
  
      runNotice("success", "logout");
    })
  }

  get_session() {
    return new ApiClient("auth").get("resource/users/me");
  }

  keep_session() {
    setTimeout(async () => {
      try {
        if (this.state != "active") return;
        await this.get_session();

        this.keep_session();
      } catch (error) {
        return error;
      }
    }, 300000);
  }

  async login(payload: {
      email: string;
      password: string;
      otp_code?: string;
      captcha_response: string;
    },
    url_callback?: string
  ) {
    this.auth_loading();

    try {
      const { data } = await new ApiClient("auth").post("identity/sessions", payload);

      if (data.state == "deleted") {
        runNotice("error", "login.deleted_account");
        return
      }

      if (!IsMobile()) {
        this.auth_success(data, "login", data.state == "active" ? url_callback : "/confirmation/email");
      } else {
        this.auth_success(data, "login");
      }

      if (data.state == "active") { 
        runNotice("success", "login");
      } else if (data.state == "pending") {
        this.session.sended_email = false;
      }
    } catch (error) {
      this.auth_error();
      return error;
    }
  }

  async register(payload: {
      email: string;
      password: string;
      refid?: string;
      captcha_response: string;
      lang?: string;
    },
    url_callback?: string
  ) {
    this.auth_loading();

    if (!payload.refid) delete payload.refid;
    payload.lang = "en";

    try {
      const { data } = await new ApiClient("auth").post("identity/users", payload);

      this.auth_success(data, "register", url_callback);

      this.session.sended_email = true;
      runNotice("warning", "email.created");

      if (IsMobile()) return;

      router.push("/confirmation/email");
    } catch (error) {
      this.auth_error();
      return error;
    }
  }

  async logout() {
    try {
      await new ApiClient("auth").delete("identity/sessions");
      ZSmartModel.emit("user/LOGOUT");
    } catch (error) {
      return error;
    }
  }

  async get_logged() {
    this.auth_loading();

    try {
      const { data } = await this.get_session();

      this.auth_success(data, "check");
    } catch (error) {
      this.auth_error();
      return error;
    }
  }

  private auth_success(payload, type: "check" | "login" | "register", url_callback?: string) {
    this.state = payload.state;
    this.email = payload.email;
    this.uid = payload.uid;
    this.role = payload.role;
    this.level = payload.level;
    this.labels = payload.labels;
    this.otp = payload.otp;
    this.phone = payload.phone;

    this.need2fa = false;

    if (payload.csrf_token) localStorage.setItem("csrf_token", payload.csrf_token);

    ZSmartModel.emit("user/LOGIN");
    if (this.state == "pending") ZSmartModel.emit("user/WAIT_EMAIL");

    if (url_callback) router.push({ path: url_callback });
  }

  private auth_loading() {
    this.state = "loading";
  }

  private auth_error() {
    this.state = null;
    localStorage.removeItem("csrf_token");
  }

  get_activity(topic: "all" | "session" | "password" | "otp", action: string, page = 1, limit = 100) {
    return new ApiClient("auth").get(`resource/users/activity/${topic}`, { action, page, limit });
  }

  async resend_email(email: string, callback?: () => void) {
    try {
      const response = await new ApiClient("auth").post("identity/users/email/generate_code", {
        email: email
      });

      runNotice("success", "check email");
      if (callback) callback();

      return response;
    } catch (error) {
      return error;
    }
  }

  async forgot_password(payload: { email: string; captcha_response: string }, callback?: () => void) {
    try {
      await new ApiClient("auth").post("/identity/users/password/generate_code", payload);
      runNotice("success", "password.forgot");
      if (callback) callback();
    } catch (error) {
      return error;
    }
  }

  async confirm_email(code: string, callback?: () => void) {
    this.auth_loading();
    try {
      const { data } = await new ApiClient("auth").post("identity/users/email/confirm_code", { email: this.email, code });
      this.state = data.state;
      localStorage.setItem("csrf_token", data.csrf_token);
      runNotice("success", "email.confirmed");
      if (callback) callback();
    } catch (error) {
      this.state = "pending";
      return error;
    }
  }

  async confirm_reset_password(email: string, code: string, password: string, confirm_password: string, callback?: () => void) {
    try {
      await new ApiClient("auth").post("identity/users/password/confirm_code", { email, code, password, confirm_password });
      runNotice("success", "password.changed");
      if (callback) callback();
    } catch (error) {
      return error;
    }
  }

  async check_code_reset_password(email: string, code: string, callback?: () => void) {
    try {
      await new ApiClient("auth").post("identity/users/password/check_code", { email, code });
      runNotice("success", "password.change");
      if (callback) callback();
    } catch (error) {
      return error;
    }
  }

  async change_password(old_password: string, new_password: string, confirm_password: string, callback?: () => void) {
    try {
      await new ApiClient("auth").put("resource/users/password", { old_password, new_password, confirm_password });

      runNotice("success", "password.changed");
      if (callback) callback();
    } catch (error) {
      return error;
    }
  }

  async get_balance() {
    try {
      const { data } = await new ApiClient("trade").get("account/balances");
      this.balances = data;
    } catch (error) {
      return error;
    }
  }

  add_update_balance(balance: ZTypes.Balance) {
    const index = this.balances.findIndex(row => {
      return row.currency === balance.currency
    });
    if (index >= 0) {
      Vue.set(this.balances, index, balance);
    } else {
      Vue.set(this.balances, this.balances.length, balance);
    }
  }

  async get_labels() {
    try {
      const { data } = await new ApiClient("auth").get("resource/labels");

      this.labels = data;
    } catch (error) {
      return error;
    }
  }

  async get_qrcode(): Promise<{ barcode: string; url: string } | null> {
    try {
      const { data } = await new ApiClient("auth").post("resource/otp/generate_qrcode");
      return data.data;
    } catch (error) {
      return null;
    }
  }

  async enable_2fa(password: string, otp_code: string, on_success?: () => void) {
    try {
      await new ApiClient("auth").post("resource/otp/enable", {
        password,
        code: otp_code
      });
      this.otp = true;
      runNotice("success", "otp.enabled");
      on_success();
    } catch (error) {
      return;
    }
  }

  async disable_2fa(otp_code: string, on_success?: () => void) {
    try {
      await new ApiClient("auth").post("resource/otp/disable", {
        code: otp_code
      });
      this.otp = false;
      runNotice("success", "otp.disabled");
      on_success();
    } catch (error) {
      return;
    }
  }

  async update_profile(
    first_name: string,
    last_name: string,
    dob: string,
    address: string,
    postcode: string,
    city: string,
    country: string
  ) {
    try {
      await new ApiClient("auth").post("resource/profiles", { first_name, last_name, dob, address, postcode, city, country, confirm: true });
      await this.get_labels();

      runNotice("success", "profile.updated")
    } catch (error) {
      return error;
    }
  }

  async update_document(doc_type: string, doc_number: string, front_upload: File, back_upload: File, in_hand_upload: File) {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const formData = new FormData();

    formData.set("doc_type", doc_type);
    formData.set("doc_number", doc_number);
    formData.append("upload[]", front_upload);
    formData.append("upload[]", back_upload);
    formData.append("upload[]", in_hand_upload);

    try {
      await new ApiClient("auth").post("resource/documents", formData, config);
      await this.get_labels();
      runNotice("success", "document.updated");
    } catch (error) {
      return error;
    }
  }

  create_api_key(algorithm: string, totp_code: string) {
    return new ApiClient("auth").post("resource/api_keys", { algorithm, totp_code });
  }

  get_beneficiaries(currency: string) {
    return new ApiClient("trade").get("account/beneficiaries", { currency_id: currency });
  }

  async create_beneficiary(currency: string, blockchain_key: string, name: string, data: string, callback?: () => void) {
    try {
      await new ApiClient("trade").post("account/beneficiaries", { currency, blockchain_key, name, data });
      runNotice("success", "address_book.created");
      if (callback) callback();
    } catch (error) {
      return error;
    }
  }

  async delete_beneficiary(beneficiary_id: number) {
    try {
      await new ApiClient("trade").delete("account/beneficiaries/#{beneficiary_id}".replace("#{beneficiary_id}", beneficiary_id.toString()));
      runNotice("success", "address_book.deleted");
    } catch (error) {
      return error;
    }
  }

  async resend_pin_beneficiary(beneficiary_id: number, callback?: () => void) {
    try {
      await new ApiClient("trade").patch("account/beneficiaries/#{beneficiary_id}/resend_pin".replace("#{beneficiary_id}", beneficiary_id.toString()));
      runNotice("success", "address_book.resend");
      if (callback) callback();
    } catch (error) {
      return error;
    }
  }

  async confirm_beneficiary(beneficiary_id: number, pin: number, callback?: () => void) {
    try {
      await new ApiClient("trade").patch("account/beneficiaries/#{beneficiary_id}/activate".replace("#{beneficiary_id}", beneficiary_id.toString()), { pin });
      runNotice("success", "address_book.confirmed");
      if (callback) callback();
    } catch (error) {
      return error;
    }
  }
}

export interface UserController extends GettersSetters {
}

applyMixins(UserController, [GettersSetters]);
const class_mounted = new UserController();

export default class_mounted;
