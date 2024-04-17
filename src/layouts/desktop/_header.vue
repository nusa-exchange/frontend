<template>
  <div class="ant-layout-header">
    <router-link to="/" class="logo">
      <img src="@/assets/img/logo.png" height="100" width="100" />
    </router-link>

    <div class="action-group left">
      <a-dropdown placement="bottomCenter">
        <a class="ant-dropdown-link">
          {{ this.translation("exchange") }}
          <i class="zicon-arrow-down" />
        </a>
        <a-menu slot="overlay">
          <a-menu-item
            :title="this.translation('exchange.basic')"
            :class="{
              'ant-dropdown-menu-item-selected': $route.name == 'ExchangePage' && TradeController.exchange_layout == 'basic',
            }"
            @click="TradeController.exchange_layout = 'basic'"
          >
            <router-link :to="{
              name: 'ExchangePage',
              params: { name: TradeController.market.name.replace('/', '-') },
              query: { type: 'basic' }
            }"
            v-text="this.translation('exchange.basic')" />
          </a-menu-item>
          <a-menu-item
            :title="this.translation('exchange.pro')"
            :class="{
              'ant-dropdown-menu-item-selected': $route.name == 'ExchangePage' && TradeController.exchange_layout == 'pro',
            }"
            @click="TradeController.exchange_layout = 'pro'"
          >
            <router-link :to="{
              name: 'ExchangePage',
              params: { name: TradeController.market.name.replace('/', '-') },
              query: { type: 'pro' }
            }"
            v-text="this.translation('exchange.pro')" />
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <router-link to="/ieo/list">IEO</router-link>
    </div>
    <div class="action-group right">
      <div v-if="isAuth" class="auth">
        <router-link to="/assets/balance">
          {{ translation("my_assets") }}
        </router-link>
        <a-dropdown placement="bottomCenter">
          <a class="ant-dropdown-link">
            {{ ORDERS_MENU.NAME }}
            <i class="zicon-arrow-down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item
              v-for="data in ORDERS_MENU.MENU"
              :key="data.url"
              :title="data.name"
              :class="{
                'ant-dropdown-menu-item-selected': path.includes(data.url)
              }"
            >
              <router-link :to="data.url" v-text="data.name" />
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <a-dropdown placement="bottomCenter">
          <a class="ant-dropdown-link">
            {{ email }}
            <i class="zicon-arrow-down" />
          </a>
          <a-menu slot="overlay" class="dropdown-user">
            <a-menu-item key="information" class="information">
              <router-link to="/account/information" tag="li">
                <div class="email">
                  {{ email }}
                </div>
                <div class="uid" v-text="`UID: ${uid}`" />
              </router-link>
            </a-menu-item>
            <a-menu-item
              v-for="data in USER_MENU.MENU"
              :key="data.url"
              :title="data.name"
              :class="[
                'ink',
                { 'ant-dropdown-menu-item-selected': path.includes(data.url) },
              ]"
            >
              <router-link :to="data.url" v-text="data.name" />
            </a-menu-item>
            <a-menu-item
              key="logout"
              title="Logout"
              class="ink"
              @click="logout"
            >
              {{ translation("user.logout") }}
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <div v-else class="un-auth">
        <router-link
          v-for="(data, index) in BUTTON"
          :key="index"
          :to="data.url"
          tag="button"
          class="ant-btn ant-btn-primary"
          v-text="data.name"
        />
      </div>
      <a-dropdown placement="bottomRight">
        <a class="ant-dropdown-link">
          {{ $t("name") }}
          <i class="zicon-arrow-down" />
        </a>
        <a-menu slot="overlay" @click="setLanguage">
          <a-menu-item
            v-for="(data, index) in messages"
            :key="index"
            :title="data.name"
            :class="{ 'ant-dropdown-menu-item-selected': locale === data.name }"
            v-text="data.name"
          />
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import config from "@/config";
import ZSmartModel from "@/library/z-eventbus";
import * as helpers from "@/library/z-helpers";
import { Vue, Component } from "vue-property-decorator";
import { i18n } from "@/plugins";
import { UserController } from "@/controllers";
import { EncryptEmail } from "@/mixins";

@Component
export default class App extends Vue {
  get uid() {
    return UserController.uid;
  }

  get email() {
    return EncryptEmail(UserController.email);
  }

  get BUTTON() {
    return [
      {
        name: this.translation("sign_in"),
        url: "/signin",
      },
      {
        name: this.translation("sign_up"),
        url: "/signup"
      },
    ];
  }

  get ORDERS_MENU() {
    return {
      NAME: this.translation("orders"),
      MENU: [
        {
          name: this.translation("orders.open_orders"),
          url: "/exchange_record/open",
        },
        {
          name: this.translation("orders.orders_history"),
          url: "/exchange_record/history",
        },
        {
          name: this.translation("orders.trades_history"),
          url: "/exchange_record/transaction",
        },
      ],
    };
  }

  get USER_MENU() {
    return {
      MENU: [
        {
          name: this.translation("user.account_security"),
          url: "/account/security",
        },
        {
          name: this.translation("user.kyc_account_verification"),
          url: "/account/kyc",
        },
        {
          name: this.translation("user.login_history"),
          url: "/account/history",
        },
        { name: this.translation("user.api"), url: "/account/api" },
      ],
    };
  }

  get messages() {
    return config.messages;
  }

  get isAuth() {
    return ["active", "pending"].includes(UserController.state);
  }

  get locale() {
    return this.$t("name");
  }

  get path() {
    return this.$route.path;
  }

  get getSelectedItemAccount() {
    const { path } = this;
    const account_path = {
      main: "/account",
      path: ["security", "kyc", "history", "api"],
      name: "ORDERS_MENU",
    };

    if (path.includes(account_path.main)) {
      const { main } = account_path;

      for (const row of account_path.path) {
        const check_path = [main, row].join("/");
        const condition = path.includes(check_path);

        if (condition) {
          return [check_path];
        }
      }
    }

    return null;
  }

  checkSelectedLang(name: string) {
    return this.$t("name") === name;
  }

  setLanguage(item) {
    const locale = item.key;
    if (this.locale === locale) {
      return;
    }
    localStorage.setItem("LANGUAGE_HASH", locale);
    i18n.locale = locale;
    ZSmartModel.emit("change-language");
  }

  logout() {
    UserController.logout();
  }

  translation(message, data = {}) {
    return helpers.translation("page.global.header." + message, data);
  }
}
</script>

<style lang="less">
@import "~@/assets/css/layouts/desktop/header";
</style>
