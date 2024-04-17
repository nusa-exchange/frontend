<template>
  <panel-view class="screen-assets screen-assets-withdraw">
    <head-bar :title="`Withdraw ${currency.id.toUpperCase()}`" @back="destroy">
      <template slot="right">
        <span @click="open_withdrawal_history_screen">History</span>
      </template>
    </head-bar>

    <currency-picker
      :currency="currency"
      @click="open_currency_picker_screen"
    />
    <networks-selection
      :currency="currency"
      v-model="blockchain_key"
    />

    <div class="screen-assets-withdraw-box">
      <assets-input
        v-model="address"
        title="Address"
        placeholder="Please paste the address here"
      />

      <assets-input
        v-model="amount"
        title="Amount"
        :note="`Available: ${available} ${currency.id.toUpperCase()}`"
      >
        <template slot="action">
          <span class="currency-name">{{ currency.id.toUpperCase() }}</span>
          <a class="max" @click="amount = available">Max</a>
        </template>
      </assets-input>

      <assets-input
        v-model="otp_code"
        title="OTP Code"
      />

      <assets-input
        v-model="confirmation_code"
        title="Confirmation Code"
        placeholder="Confirmation code from email here"
      >
        <template slot="action">
          <span
            style="color: var(--blue-color);padding: 0;width: 50px;font-weight: 500;"
            :disabled="this.cooldown > 0"
            @click.prevent="resend_code"
          >
            <span v-if="this.loading_resend">
              {{ $t("page.global.action.sending") }}
            </span>
            <span v-else>{{ this.cooldown ? "Resend" : "Send Code" }}</span>
            <span v-if="cooldown">({{ cooldown }})</span>
          </span>
        </template>
      </assets-input>
    </div>

    <div class="screen-assets-notice">
      <div class="screen-assets-notice-title">Notice:</div>
      <div class="screen-assets-notice-content">
        • Do not withdraw directly to a cowdfund or ICO. We will not credit your
        account with tokens from that sale.
        <br />
        • Once you have to submitted your withdrawal request, we will send a
        confirmation email.
      </div>
    </div>

    <div class="screen-assets-withdraw-tab-bar">
      <div class="screen-assets-withdraw-tab-bar-note">
        You will get:
        <br />
        <span class="value">
          {{ amount || "0.0" }} {{ currency.id.toUpperCase() }}
        </span>
        <br />
        Transaction Fee {{ this.currency.withdraw_fee }}
        {{ currency.id.toUpperCase() }}
      </div>
      <button
        class="screen-assets-withdraw-tab-bar-button"
        :disabled="!address || !amount || available < Number(amount)"
        @click="submit_withdrawal()"
      >
        Withdrawal
      </button>
    </div>
  </panel-view>
</template>

<script lang="ts">
import { ScreenMixin } from "@/mixins/mobile";
import { Component, Mixins, Watch } from "vue-property-decorator";
import { PublicController, TradeController } from "@/controllers";
import * as helpers from "@/library/z-helpers";
import { ConfirmationMixin } from "@/mixins";

@Component({
  components: {
    "networks-selection": () =>
      import("@/layouts/mobile/screens/assets/networks-selection.vue"),
    "currency-picker": () =>
      import("@/layouts/mobile/screens/assets/deposit/currency-picker.vue"),
    "assets-input": () => import("@/layouts/mobile/assets/assets-input.vue")
  }
})
export default class AssetsWithdrawScreen extends Mixins(ScreenMixin, ConfirmationMixin) {
  loading = false;
  currency = PublicController.currencies[0];
  address = "";
  amount = "";
  blockchain_key = "";
  otp_code = "";
  confirmation_code = "";

  $refs: {
    [key: string]: ScreenMixin;
  }

  get assets() {
    return new helpers.Balance(this.currency.id);
  }

  get available() {
    return this.assets.available;
  }

  before_panel_create(currency: ZTypes.Currency) {
    this.currency = currency;
    this.blockchain_key = this.currency.networks[0].blockchain_key;
  }

  open_currency_picker_screen() {
    (this.$parent as any).open_assets_currency_picker_screen("withdraw");
  }

  open_withdrawal_history_screen() {
    (this.$parent as any).open_assets_history_screen("withdrawal");
  }

  open_verify_otp_screen() {
    this.$refs["screen-verify-otp"].create();
  }

  close_verify_otp_screen() {
    this.$refs["screen-verify-otp"].destroy();
  }

  async submit_withdrawal() {
    this.loading = true;

    await TradeController.create_withdrawal(
      this.currency.id,
      Number(this.amount),
      this.otp_code,
      this.confirmation_code,
      this.address,
      this.blockchain_key,
      null,
      () => {
        
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

  @Watch("amount")
  onAmountChanged(amount: string) {
    this.amount = helpers.inputOnlyNumber(amount, 8);
  }
}
</script>

<style lang="less">
.screen-assets-withdraw {
  &-box {
    margin: 0 8px;

    .z-auth-input {
      margin-top: 12px;
    }

    .currency-name {
      color: var(--color-gray);
      margin-right: 4px;
    }

    .max {
      font-weight: 500;
    }
  }

  .screen-assets-notice {
    margin-top: 16px;
  }

  &-tab-bar {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--border-color);
    padding: 8px 12px;

    &-note {
      color: var(--color-gray);
      line-height: 1;
      font-size: 9px;
      .value {
        color: #fff;
        font-size: 13px;
        font-weight: 500;
        line-height: 1.5;
      }
    }

    &-button {
      height: 25px;
      line-height: 25px;
      padding: 0 8px;
      background-color: var(--blue-color);
      font-size: 12px;
      font-weight: 500;
      border-radius: 2px;

      &:disabled {
        background-color: var(--disabled-color);
        cursor: not-allowed;
      }
    }
  }
}
</style>
