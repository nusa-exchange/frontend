<template>
  <div class="page-assets-m">
    <div class="assets-head">
      <div class="assets-estimate">
        <div class="assets-estimate-title">Estimated Value (BTC):</div>
        <div class="assets-estimate-content">
          <span class="assets-estimate-value">0.00000000</span>
          <span class="assets-estimate-value-fiat">$0.00</span>
        </div>
      </div>
      <div class="assets-action">
        <div
          class="assets-action-item"
          @click="open_assets_currency_picker_screen('deposit')"
        >
          Deposit
        </div>
        <div
          class="assets-action-item"
          @click="open_assets_currency_picker_screen('withdraw')"
        >
          Withdraw
        </div>
        <!-- <div class="assets-action-item" disabled>
          Transfer
        </div> -->
      </div>
    </div>
    <div class="assets-table" :style="assets_table_style">
      <assets-row
        v-for="currency in currencies"
        :key="currency.id"
        :currency="currency"
        @click="open_assets_preview_screen(currency)"
      />
    </div>

    <screen-assets-preview
      ref="screen-assets-preview"
      @click="open_screen_by_type_and_currency"
    />
    <screen-assets-deposit ref="screen-assets-deposit" />
    <screen-assets-withdraw ref="screen-assets-withdraw" />
    <screen-assets-currency-picker
      ref="screen-assets-currency-picker"
      @click="open_screen_by_type_and_currency"
    />
    <screen-assets-history ref="screen-assets-history" />
    <warning-modal ref="warning-modal" />
  </div>
</template>

<script lang="tsx">
import { ScreenMixin } from "@/mixins/mobile";
import { Vue, Component } from "vue-property-decorator";
import { PublicController, UserController } from "@/controllers";

@Component({
  components: {
    "assets-row": () => import("@/layouts/mobile/assets/assets-row.vue"),
    "screen-assets-preview": () =>
      import("@/views/mobile/screens/assets/preview.vue"),
    "screen-assets-deposit": () =>
      import("@/views/mobile/screens/assets/deposit.vue"),
    "screen-assets-withdraw": () =>
      import("@/views/mobile/screens/assets/withdraw.vue"),
    "screen-assets-currency-picker": () =>
      import("@/views/mobile/screens/assets/currency-picker.vue"),
    "screen-assets-history": () =>
      import("@/views/mobile/screens/assets/history"),
    "warning-modal": () => import("@/layouts/mobile/assets/warning-modal.vue")
  }
})
export default class Assets extends Vue {
  $refs!: {
    [key: string]: ScreenMixin;
  };

  assets_table_style = {
    height: "0",
    marginTop: "0",
    marginBottom: "0"
  };

  get user_otp() {
    return UserController.otp;
  }

  get currencies() {
    return PublicController.currencies;
  }

  mounted() {
    const marginBottom = 50;
    const marginTop = document.querySelector(".assets-head").clientHeight;

    this.assets_table_style.marginTop = `${marginTop.toString()}px`;
    this.assets_table_style.height = `calc(100vh - ${marginTop}px - ${marginBottom}px)`;
  }

  open_screen_by_type_and_currency(type: string, currency: ZTypes.Currency) {
    this[`open_assets_${type}_screen`](currency);
  }

  open_assets_preview_screen(currency: ZTypes.Currency) {
    this.$nextTick(() => {
      this.open_screen("preview", currency);
    });
  }

  open_assets_deposit_screen(currency: ZTypes.Currency) {
    if (this.user_otp) {
      this.open_screen("deposit", currency);
    } else {
      this.open_warning_modal();
    }
  }

  open_assets_withdraw_screen(currency: ZTypes.Currency) {
    if (this.user_otp) {
      this.open_screen("withdraw", currency);
    } else {
      this.open_warning_modal();
    }
  }

  open_assets_currency_picker_screen(type: string) {
    if (this.user_otp) {
      this.open_screen("currency-picker", type);
    } else {
      this.open_warning_modal();
    }
  }

  open_assets_history_screen(type: string) {
    this.$refs["screen-assets-history"].create(type);
  }

  open_warning_modal() {
    (this.$refs["warning-modal"] as any).create();
  }

  open_screen(screen: string, payload?: any) {
    this.$refs[`screen-assets-${screen}`].create(payload);
  }
}
</script>

<style lang="less">
.page-assets-m {
  position: relative;

  .assets-head {
    position: fixed;
    width: 100%;
    padding: 12px 8px;
    background-color: var(--bg-card-color);

    .assets-estimate {
      padding: 0 8px;
      font-weight: 500;

      &-title {
        color: var(--color-gray);
      }

      &-value {
        font-size: 16px;

        &-fiat {
          margin-left: 4px;
          color: var(--color-gray);
        }
      }
    }

    .assets-action {
      padding: 0 8px;
      margin-top: 8px;
      display: flex;

      &-item {
        flex: 1;
        line-height: 20px;
        margin: 0 8px;
        text-align: center;
        border: 1px solid var(--border-color);
        cursor: pointer;

        &:first-child {
          margin-left: 0;
        }

        &:last-child {
          margin-right: 0;
        }

        &:disabled {
          cursor: not-allowed;
          //TODO add color background for disabled item
        }
      }
    }
  }

  .assets-table {
    overflow: auto;
    margin-left: 12px;
    margin-right: 12px;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    .assets-row {
      margin: 4px 0;
      cursor: pointer;
    }
  }
}

.screen-assets {
  &-notice {
    padding: 8px;
    color: var(--color-gray);

    &-title {
      font-weight: 500;
    }

    &-content {
      margin-top: 4px;
    }
  }
}
</style>
