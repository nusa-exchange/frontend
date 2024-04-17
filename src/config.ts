import getUrl from "@/getUrl";
import en from "@/plugins/locales/en";
import vn from "@/plugins/locales/vn";

const nameEX = "NusaEx";

export default {
  nameEX,
  "default_market": "ethusdt",
  "feature_markets": ["ethusdt", "btcusdt"],
  "list_bid": ["ETH", "BTC", "USDT"],
  "messages": {
    en
  },
  "api": {
    url: "/api/v2/",
    ws: {
      public: getUrl(true) + "/api/v2/websocket/public",
      private:
        getUrl(true) +
        "/api/v2/websocket/private?stream=order&stream=trade&stream=balance",
    },
  },
  "finex": true,
  "recaptcha": {
    sitekey: "6Lfy54QbAAAAAF68FeH5PNbvm1aeMbE1goAPx4F6",
  },
  "timeZone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  "SESSION_KEY": "ALLOW-ALL", // For use on exchange
  /** default **/
  "titlePage.default": `Nusa Exchange | Cryptocurrency Exchange | ${nameEX}`,
  /** 404 **/
  "titlePage.404": `404`,
  /**  public **/
  "titlePage.main": `Nusa Exchange | Cryptocurrency Exchange | ${nameEX}`,
  "titlePage.exchange": `Nusa Exchange | Cryptocurrency Exchange | ${nameEX}`,
  /**  unauth **/
  "titlePage.signin": `Log In - ${nameEX}`,
  "titlePage.signup": `Sign Up - ${nameEX}`,
  "titlePage.forgotpassword": `Forgot Login Password - ${nameEX}`,
  "titlePage.confirmation.reset_password": `Reset Login Password - ${nameEX}`,
  "titlePage.confirmation.email": `Email Verification - ${nameEX}`,
  /**  auth **/
  "titlePage.assets.balance": `My Assets - ${nameEX}`,
  "titlePage.exchange_record.open": `Open Orders - ${nameEX}`,
  "titlePage.exchange_record.history": `Order History - ${nameEX}`,
  "titlePage.exchange_record.transaction": `Trade History - ${nameEX}`,
  "titlePage.account.information": `Account Information - ${nameEX}`,
  "titlePage.account.security": `Account Security - ${nameEX}`,
  "titlePage.account.kyc": `Account KYC - ${nameEX}`,
  "titlePage.account.history": `Login History - ${nameEX}`,
  "titlePage.account.api": `Account Api Keys - ${nameEX}`,
};
