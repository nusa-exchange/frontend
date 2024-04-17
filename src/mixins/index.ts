import { notification } from "@/plugins/antd/custom";
import VueI18n, { TranslateResult } from "vue-i18n";
import { i18n } from "@/plugins";
import { IsMobile } from "./helpers";

export function EncryptEmail(email: string) {
  if (!email) return;
  let email_name = email.split("@")[0];
  let email_domain = email.split("@")[1];
  email_name = [email_name.slice(0, 2), "**"].join("");
  email_domain = ["**", email_domain.split(".")[1]].join(".");

  return [email_name, email_domain].join("@");
}

export const runNotice = (type: ZTypes.NoticeType | "t-success" | "t-info" | "t-warning" | "t-error", message: string | TranslateResult, config?: VueI18n.Values) => {
  if (!message) return;

  if (type.includes("t-")) {
    return notification[type.replace("t-", "")]({ message: message, placement: IsMobile() ? "bottomCenter" : "topRight" });
  } else {
    return notification[type]({ message: i18n.t(`${type}.${message}`, config), placement: IsMobile() ? "bottomCenter" : "topRight" });
  }
};

export const wait_and_callback = (reason: () => boolean, callback: () => any) => {
  if (reason()) {
    callback();
  } else {
    setTimeout(() => {
      wait_and_callback(reason, callback);
    }, 10);
  }
}

export const assets_state_color = (state: string) => {
  const loading_state = [
    "aml_processing",
    "fee_processing",
    "processing",
    "confirming"
  ];
  const done_state = ["collected", "completed", "succeed"];
  const warning_state = ["canceled"];
  const error_state = ["errored", "to_reject", "rejected", "failed"];

  if (loading_state.includes(state)) return "color-loading";
  if (done_state.includes(state)) return "color-success";
  if (warning_state.includes(state)) return "color-warning";
  if (error_state.includes(state)) return "color-error";
}

export * from "./helpers";

export * from "./auth_mixin";
export * from "./market_channels";
export * from "./trade-action";
export * from "./confirmation_mixin";
export * from "./modal_mixin";