<template>
  <z-content class="page-user">
    <div class="container">
      <ul class="setting-menu">
        <li class="avatar-user">
          <img src="@/assets/img/avatar.png" />
          <p class="uid">UID: {{ uid }}</p>
          <div class="email">{{ email }}</div>
        </li>
        <router-link
          v-for="(data, index) in MENU"
          :key="index"
          tag="li"
          :to="data.url"
          :class="{ selected: $route.path === data.url }"
          class="pick"
        >
          <i :class="data.icon" />
          <span v-text="data.text" />
        </router-link>
      </ul>
      <router-view />
    </div>
  </z-content>
</template>

<script lang="ts">
import { EncryptEmail } from "@/mixins";
import { UserController } from "@/controllers";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Account extends Vue {
  get uid() {
    return UserController.uid;
  }

  get email() {
    return EncryptEmail(UserController.email);
  }

  get MENU() {
    return [
      {
        icon: "zicon-personal",
        text: this.$t("page.account.account_information.title"),
        url: "/account/information"
      },
      {
        icon: "zicon-anquan",
        text: this.$t("page.account.account_security.title"),
        url: "/account/security"
      },
      {
        icon: "zicon-shenfen",
        text: this.$t("page.account.kyc_account_verification.title"),
        url: "/account/kyc"
      },
      {
        icon: "zicon-date",
        text: this.$t("page.account.login_history.title"),
        url: "/account/history"
      },
      {
        icon: "zicon-API",
        text: this.$t("page.account.api.title"),
        url: "/account/api"
      }
    ];
  }
}
</script>
