<template>
  <panel-view class="screen-assets screen-assets-deposit assets-deposit">
    <head-bar :title="`Deposit ${currency.id.toUpperCase()}`" @back="destroy">
      <template slot="right">
        <span @click="open_deposit_history_screen">History</span>
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
    <deposit-address-box
      :currency="currency"
      :deposit_address="deposit_address"
    />

    <div class="screen-assets-notice">
      <div class="screen-assets-notice-title">Notice:</div>
      <div class="screen-assets-notice-content">
        • Deposit to the above address requires
        {{ this.currency.min_confirmations }} confirmations
      </div>
    </div>
  </panel-view>
</template>

<script lang="ts">
import { ScreenMixin } from "@/mixins/mobile";
import { Mixins, Component, Watch } from "vue-property-decorator";
import { PublicController, TradeController } from "@/controllers";

@Component({
  components: {
    "networks-selection": () =>
      import("@/layouts/mobile/screens/assets/networks-selection.vue"),
    "currency-picker": () =>
      import("@/layouts/mobile/screens/assets/deposit/currency-picker.vue"),
    "deposit-address-box": () =>
      import("@/layouts/mobile/screens/assets/deposit/address-box.vue")
  }
})
export default class DepositScreen extends Mixins(ScreenMixin) {
  loading = false;
  deposit_address = "Loading";
  currency = PublicController.currencies[0];
  blockchain_key?: string = null;

  before_panel_create(currency: ZTypes.Currency) {
    this.currency = currency;
    this.blockchain_key = this.currency.networks[0].blockchain_key;
    this.get_deposit_address();
  }

  open_currency_picker_screen() {
    (this.$parent as any).open_assets_currency_picker_screen("deposit");
  }

  async get_deposit_address() {
    this.deposit_address = "Loading";
    this.loading = true;

    try {
      const payment_address = await TradeController.get_deposit_address(
        this.currency.id,
        this.blockchain_key
      );
      this.deposit_address = payment_address.address || "Error";
    } catch (error) {
      this.deposit_address = "Error";
      return error;
    } finally {
      this.loading = false;
    }
  }

  open_deposit_history_screen() {
    (this.$parent as any).open_assets_history_screen("deposit");
  }

  @Watch("blockchain_key")
  onBlockChainKeyChanged() {
    this.get_deposit_address();
  }
}
</script>

<style lang="less">
.assets-deposit {
  .head-bar {
    background-color: transparent;
  }

  &-currency {
    &-picker {
      position: relative;
      height: 32px;
      line-height: 32px;
      width: 100%;
      padding: 0 8px;
      background-color: var(--bg-card-color);
      font-weight: 500;

      > * {
        display: inline-block;
        vertical-align: top;
      }
    }

    &-logo {
      height: 32px;
      display: inline-block;
      margin-right: 8px;

      &-wrapper {
        height: 32px;
        vertical-align: middle;
        text-align: center;
        display: table-cell;
      }

      &-content {
        height: 24px;
        width: 24px;
        background-color: var(--border-color);
        border-radius: 24px;
        vertical-align: middle;
        text-align: center;
        display: table-cell;

        img {
          height: 16px;
          width: 16px;
          display: block;
          margin: 0 auto;
        }
      }
    }

    &-code {
      font-size: 12px;
      margin-right: 4px;
    }

    &-name {
      font-size: 8px;
      color: var(--color-gray);
      vertical-align: baseline;
    }

    &-action {
      position: absolute;
      right: 8px;
      font-size: 12px;
      color: var(--color-gray);
    }
  }

  &-address {
    &-box {
      padding: 12px 8px;
      margin-top: 8px;
      background-color: var(--bg-card-color);
    }

    &-title {
      font-size: 10px;
      font-weight: 500;
      color: var(--color-gray);
    }

    &-qrcode {
      margin: 12px 0;
      text-align: center;

      canvas {
        padding: 12px;
        background-color: #fff;
      }
    }

    &-value {
      margin-bottom: 12px;
      font-size: 12px;
      text-align: center;
      font-weight: 500;
    }

    &-action {
      text-align: center;

      button {
        color: var(--blue-color);
        font-size: 11px;
        font-weight: 500;
        height: 25px;
        border-radius: 2px;
        border: 1px solid;
        padding: 0 12px;
      }
    }
  }
}
</style>
