<template>
  <div class="setting-main security">
    <div class="setting-head">
      {{ translation("title") }}
    </div>
    <div class="setting-body">
      <table class="table">
        <tr v-for="(data, index) in account_security" :key="index" class="row">
          <td class="name" v-html="data.name" />
          <td class="desc" v-html="data.desc" />
          <td class="action">
            <a
              v-if="data.action.allow"
              @click="onClick(data.action.runner)"
              v-html="data.action.text"
            />
          </td>
        </tr>
      </table>
    </div>
    <modal-2fa ref="2fa" />
    <modal-password ref="password" @change-modal="onClick" />
    <modal-totp ref="turn-off-2fa" :loading="turn_off_2fa_loading" @submit="turn_off_2fa" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import * as helpers from "@/library/z-helpers";
import ModalTOTP from "@/layouts/desktop/modal/_modal_totp.vue";
import _modal_2fa from "@/layouts/desktop/account/_modal_2fa.vue";
import _modal_password from "@/layouts/desktop/account/_modal_password.vue";
import Helpers from "./helpers";

@Component({
  components: {
    "modal-totp": ModalTOTP,
    "modal-2fa": _modal_2fa,
    "modal-password": _modal_password
  },
  mixins: [Helpers]
})
export default class AccountSecurity extends Vue {
  turn_off_2fa_loading = false;

  get account_security() {
    return [
      {
        status: true,
        name: this.$t("page.global.table.password"),
        desc: this.translation("password.desc"),
        action: {
          allow: true,
          text: this.$t("page.global.action.change_password"),
          runner: "password"
        }
      },
      {
        status: this.UserController.otp,
        name: this.$t("page.global.table.otp"),
        desc: this.translation("otp.desc"),
        action: {
          allow: true,
          text: this.$t(this.UserController.otp ? "page.global.action.turn_off" : "page.global.action.settings"),
          runner: this.UserController.otp ? "turn-off-2fa" : "2fa"
        }
      }
    ];
  }

  async turn_off_2fa(otp_code) {
    this.turn_off_2fa_loading = true;
    await this.UserController.disable_2fa(otp_code, () => {
      (this.$refs["turn-off-2fa"] as any).delete();
    });
    this.turn_off_2fa_loading = false;
  }

  translation(message: string, data?: {}) {
    return helpers.translation("page.account.account_security." + message, data);
  }
}
</script>
