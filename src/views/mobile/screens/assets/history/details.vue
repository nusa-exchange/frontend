<template>
  <panel-view class="screen-assets screen-assets-details">
    <head-bar :title="`${$t(`title.${type}`)} Details`" @back="destroy" />
    <template v-if="record">
      <div class="screen-assets-details-title">
        Amount
      </div>
      <div class="screen-assets-details-amount">
        <span class="value">{{ record.amount }}</span>
        <span class="currency-name">
          {{ currency.name }}
        </span>
      </div>
      <div class="screen-assets-details-info">
        <p class="screen-assets-details-info-line">
          <span class="title">Address</span>
          <span class="value">{{ type == 'deposit' ? record.from_addresses[0] : record.rid }}</span>
        </p>
        <p class="screen-assets-details-info-line">
          <span class="title">Transaction Fee</span>
          <span class="value">{{ record.fee }}</span>
        </p>
        <p class="screen-assets-details-info-line">
          <span class="title">Txid</span>
          <span class="value">{{ txid }}</span>
        </p>
        <p class="screen-assets-details-info-line">
          <span class="title">Date</span>
          <span class="value">{{ created_at }}</span>
        </p>
      </div>
      <div class="screen-assets-details-tab-bar">
        <button @click="copy_txid">Copy Txid</button>
        <a :href="explorer_url" target="_blank" tag="explorer">
          Check Explorer
        </a>
      </div>
    </template>
  </panel-view>
</template>

<script lang="ts">
import { copyText, getDate } from "@/library/z-helpers";
import { PublicController } from "@/controllers";
import { ScreenMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";
import { runNotice } from "@/mixins";

@Component({
  components: {
    "screen-verify-otp": () => import("@/views/mobile/screens/verify/totp.vue")
  }
})
export default class AssetsHistoryDetails extends Mixins(ScreenMixin) {
  type?: "deposit" | "withdrawal" = null;
  record?: ZTypes.Deposit | ZTypes.Withdraw = null;

  get currency() {
    return PublicController.currencies.find(
      currency => currency.id == this.record?.currency
    );
  }

  get network() {
    return this.currency.networks.find(network => network.blockchain_key == this.record.blockchain_key);
  }

  get txid() {
    return (
      (this.record as ZTypes.Deposit)?.txid ||
      (this.record as ZTypes.Withdraw)?.blockchain_txid
    );
  }

  get explorer_url() {
    return this.network?.explorer_transaction?.replace("#{txid}", this.txid);
  }

  get created_at() {
    if (!this.record) return;

    return getDate(this.record?.created_at, true);
  }

  before_panel_create(payload: any) {
    this.type = payload.type;
    this.record = payload.record;
  }

  panel_created() {
    this.$nextTick(() => {
      this.$forceUpdate();
    });
  }

  close_panel(name: string) {
    (this.$refs[name] as any).destroy();
  }

  copy_txid() {
    copyText(this.txid);
    runNotice("success", "copy");
  }
}
</script>

<style lang="less">
.screen-assets-details {
  &-title {
    color: var(--color-gray);
    font-weight: 500;
    font-size: 10px;
    text-align: center;
    margin-top: 24px;
  }

  &-amount {
    margin-top: 6px;
    text-align: center;
    font-weight: 500;

    .value {
      font-size: 16px;
    }

    .currency-name {
      font-size: 12px;
    }
  }

  &-info {
    margin-top: 12px;
    padding: 12px;
    background-color: var(--border-color);

    &-line {
      display: flex;
      padding: 2px 0;
      line-height: 1.5;

      > * {
        flex: 1;
      }

      .title {
        color: var(--color-gray);
        flex: 0 0 75px;
      }

      .value {
        text-align: right;
        word-break: break-all;
      }
    }
  }

  &-tab-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    padding: 8px 12px;

    > * {
      flex: 1;
      height: 25px;
      color: #fff;
      background-color: var(--border-color);
      padding: 0;
      text-align: center;
      font-weight: 500;
      font-size: 11px;
      line-height: 25px;
      border-radius: 3px;
      cursor: pointer;

      &:first-child {
        margin-right: 6px;
      }

      &:last-child {
        margin-left: 6px;
      }
    }

    a {
      background-color: var(--blue-color);
      color: var(--bg-card-color);
    }
  }
}
</style>
