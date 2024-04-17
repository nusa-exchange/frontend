<template>
  <div class="setting-main information">
    <div class="setting-head">
      {{ translation("title") }}
    </div>
    <div class="setting-body">
      <table class="table">
        <tr
          v-for="(data, index) in account_informations"
          :key="index"
          class="row"
        >
          <td class="name" v-text="data.name" />
          <td class="desc" v-text="data.desc" />
          <td v-if="data.type === 'text'" class="value" v-text="data.value" />
          <td v-else class="action">
            <a @click="onClick(data.action.runner)" v-text="data.action.text" />
          </td>
        </tr>
      </table>
    </div>

    <modal-phone ref="phone" />
  </div>
</template>

<script lang="ts">
import * as helpers from "@/library/z-helpers";
import { Vue, Component } from "vue-property-decorator";
import _modal_phone from "@/layouts/desktop/account/_modal_phone.vue";
import Helpers from "./helpers";
import { UserController } from "@/controllers";
import { EncryptEmail, runNotice } from "@/mixins";

@Component({
  components: {
    "modal-phone": _modal_phone
  },
  mixins: [Helpers]
})
export default class AccountInformation extends Vue {
  get account_informations() {
    return [
      {
        name: this.$t("page.global.table.uid"),
        type: "action",
        desc: `Click to get invite link`,
        action: {
          allow: true,
          text: this.$t("page.global.action.open"),
          runner: () => {
            this.$router.push("/referral");
          }
        }
      },
      {
        name: this.$t("page.global.table.email"),
        type: "text",
        desc: this.translation("email.desc"),
        value: EncryptEmail(UserController.email)
      },
      {
        name: this.$t("page.global.table.phone"),
        type: UserController.phone?.validated_at ? "text" : "action",
        desc: this.translation("phone.desc"),
        value: UserController.phone?.validated_at
          ? "+" + UserController.phone.number
          : "",
        action: {
          allow: !UserController.phone?.validated_at,
          text: this.$t("page.global.action.settings"),
          runner: "phone"
        }
      }
    ];
  }

  translation(message: string, data?: {}) {
    return helpers.translation("page.account.account_information." + message, data);
  }
}
</script>
