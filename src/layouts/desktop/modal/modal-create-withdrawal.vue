<template>
  <a-modal
    v-model="modal_enabled"
    wrap-class-name="confirm-withdrawal-modal"
    :footer="null"
    :width="400"
  >
    <a-icon type="warning" class="logo-modal" />
    <div class="title">
      {{ translation("title") }}
    </div>
    <div class="desc">
      {{ translation("desc") }}
    </div>
    <form @submit.prevent="create_withdrawal">
      <auth-input
        v-model="otp_code"
        name="otp_code"
        placeholder="2FA Code"
        :placeholder-need="true"
        maxlength="6"
        type="number"
      />
      <auth-input
        v-model="confirmation_code"
        name="confirmation_code"
        :placeholder="$t('page.global.placeholder.confirmation_code')"
        :placeholder-need="true"
        maxlength="6"
        type="number"
      >
        <template slot="right-action">
          <button :disabled="cooldown > 0" @click.prevent="resend_code">
            <template v-if="cooldown > 0">Resend({{ cooldown }})</template>
            <template v-else>
              Send code
            </template>
          </button>
        </template>
      </auth-input>

      <auth-button
        type="submit"
        :loading="loading"
        :disabled="confirmation_code.length < 6"
      >
        {{ $t("page.global.action.confirm") }}
      </auth-button>
    </form>
  </a-modal>
</template>

<script lang="ts">
import * as helpers from "@/library/z-helpers";
import { ConfirmationMixin, ModalMixin } from "@/mixins";
import { Mixins, Component } from "vue-property-decorator";

@Component({
  components: {
    "auth-input": () => import("@/components/desktop/auth-input.vue"),
    "auth-button": () => import("@/components/desktop/auth-button.vue")
  }
})
export default class ModalCreateithdrawal extends Mixins(
  ModalMixin,
  ConfirmationMixin
) {
  currency: ZTypes.Currency
  type: "address" | "book";
  amount: string;
  blockchain_key?: string;
  address: string;
  beneficiary?: ZTypes.Beneficiary;

  loading = false;
  otp_code = "";
  confirmation_code = "";

  onCreate(payload: { currency: ZTypes.Currency, type: "address" | "book", amount: string, blockchain_key?: string, address?: string, beneficiary?: ZTypes.Beneficiary }) {
    this.currency = payload.currency;
    this.type = payload.type;
    this.amount = payload.amount;
    this.blockchain_key = payload.blockchain_key;
    this.address = payload.address;
    this.beneficiary = payload.beneficiary;
  }

  async create_withdrawal() {
    this.loading = true;

    await this.TradeController.create_withdrawal(
      this.currency.id,
      Number(this.amount),
      this.otp_code,
      this.confirmation_code,
      this.type == "address" ? this.address : null,
      this.type == "address" ? this.blockchain_key : null,
      this.type == "book" ? this.beneficiary.id.toString() : null,
      () => {
        this.delete();
      }
    );

    this.loading = false;
  }

  async resend_code() {
    this.loading_resend = true;

    await this.TradeController.generate_withdrawal_code(
      this.currency.id,
      Number(this.amount),
      () => {
        this.start_cooldown();
      }
    );

    this.loading_resend = false;
  }

  translation(message, data = {}) {
    return helpers.translation("modal.withdraw." + message, data);
  }
}
</script>
