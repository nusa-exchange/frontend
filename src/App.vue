<template>
  <a-layout
    :class="{
      night: $route.path.includes('/exchange'),
      'no-border': $route.path.includes('/exchange')
    }"
  >
    <template v-if="page_ready">
      <HeaderExchange v-if="!helpers.IsMobile()" />
      <router-view />
      <MobileLoginScreen v-if="helpers.IsMobile()" ref="auth-login-screen" />
      <MobileConfirmEmailScreen
        v-if="helpers.IsMobile()"
        ref="auth-confirm-email-screen"
      />
      <TabBar v-if="helpers.IsMobile()" />

      <FooterExchange v-if="!($route.name == 'ExchangePage' && exchange_layout == 'pro') && !helpers.IsMobile()" />
    </template>
    <transition name="loading-move">
      <LoadingPage v-if="!page_ready" />
    </transition>
  </a-layout>
</template>

<script lang="ts">
import config from "@/config";
import setTheme from "@/library/setTheme";
import ZSmartModel from "@/library/z-eventbus";
import { Vue, Component } from "vue-property-decorator";
import colors from "@/colors";
import { PublicController } from "./controllers";
import { wait_and_callback } from "@/mixins";
import LoadingPage from "@/layouts/loading-page.vue";
import HeaderExchange from "@/layouts/desktop/_header.vue";
import FooterExchange from "@/layouts/desktop/_footer.vue";
import TabBar from "@/layouts/mobile/_tab_bar.vue";
import MobileLoginScreen from "@/views/mobile/screens/auth/login";
import MobileConfirmEmailScreen from "@/views/mobile/screens/auth/confirm_email"

@Component({
  components: {
    HeaderExchange,
    FooterExchange,
    LoadingPage,
    TabBar,
    MobileLoginScreen,
    MobileConfirmEmailScreen
  }
})
export default class App extends Vue {
  public $refs!: {
    [key: string]: any;
  };

  get page_ready() {
    return PublicController.page_ready;
  }

  get exchange_layout() {
    return this.TradeController.exchange_layout;
  }

  public beforeCreate() {
    "localStorage" in window;
    if (localStorage.getItem("market") == null) {
      localStorage.setItem("market", config.default_market);
    }
    if (localStorage.getItem("LANGUAGE_HASH") == null) {
      localStorage.setItem("LANGUAGE_HASH", "en");
    }
    if (
      localStorage.getItem("exchangeTheme") == null ||
      localStorage.getItem("exchangeTheme") == "light"
    ) {
      localStorage.setItem("exchangeTheme", "night");
    }
  }

  mounted() {
    this.setTheme();

    if (this.helpers.IsMobile()) {
      let first_time = true;

      document.body.classList.add("mobile-view");
      this.$router.afterEach(() => {
        if (!first_time) return;

        first_time = false;

        ZSmartModel.on("need-login", (callback?: (args: any) => void) => {
          this.$refs["auth-login-screen"].create(callback);
        });

        history.pushState(null, document.title, location.href);
        window.addEventListener("popstate", () => {
          history.pushState(null, document.title, location.href);
        });
      });

      ZSmartModel.on("user/WAIT_EMAIL", () => {
        wait_and_callback(
          () => this.page_ready && this.$refs["auth-confirm-email-screen"],
          () => {
            this.$refs["auth-confirm-email-screen"].create();
          }
        );
      });
    }
  }

  openPanel(panel: string, callback?: (args: any) => void) {
    this.$refs[panel].create(callback);
  }

  setTheme() {
    new setTheme().setTheme(colors);
  }
}
</script>

<style lang="less">
//TODO: move this less file to another file vue

@import "~@/assets/css/themes/mobile/index";


.loading-move {
  &-leave-active {
    transform: translate(100%, 0);
  }

  &-enter-active,
  &-leave-active {
    transition: transform 0.3s;
  }
}
</style>
