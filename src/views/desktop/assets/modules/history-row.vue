<template>
  <dl :class="{ selected: txid_box_opening }">
    <span
      :class="[
        'status',
        {
          loading: ['processing', 'confirming'].includes(record.state),
          error: ['errored', 'rejected', 'failed', 'to_reject'].includes(
            record.state
          ),
          success: ['succeed', 'completed', 'accepted', 'collected'].includes(record.state)
        }
      ]"
    >
      {{ $t(`page.assets.history.state.${record.state}`) }}
      <span v-if="record.state == 'processing' || record.state == 'confirming'">
        ({{ record.confirmations }}/{{ currency.min_confirmations }})
      </span>
    </span>
    <span class="coin" v-text="record.currency.toUpperCase()" />
    <span class="network" v-text="record.protocol" />
    <span class="amount" v-text="Number(record.amount).toFixed(8)" />
    <span class="date" v-text="getDate(record.created_at)" />
    <span class="infomation">
      <div class="address">
        <span class="title">{{ $t("page.global.placeholder.address") }}:</span>
        <a
          v-if="txid_box_opening"
          :href="network.explorer_address.replace('#{address}', type == 'deposit' ? record.from_addresses[0] : record.rid)"
          target="_blank"
          v-text="type == 'deposit' ? record.from_addresses[0] : record.rid"
        />
        <span v-else v-text="type == 'deposit' ? record.from_addresses[0] : record.rid" />
      </div>
      <div class="txid" :class="[txid_box_opening ? 'show' : 'hide']">
        <span class="title">{{ $t("page.global.placeholder.txid") }}:</span>
        <a
          :href="
            network.explorer_transaction.replace(
              '#{txid}',
              record.txid || record.blockchain_txid
            )
          "
          target="_blank"
          v-text="record.txid || record.blockchain_txid"
        />
      </div>
    </span>
    <span class="action text-right">
      <i
        v-if="type == 'deposit'"
        class="zicon-arrow-down"
        @click="change_txid_box"
      />
      <i
        v-if="record.state != 'prepared' && type == 'withdraw'"
        class="zicon-arrow-down"
        @click="change_txid_box"
      />
    </span>
  </dl>
</template>

<script lang="ts">
import * as helpers from "@/library/z-helpers";
import ZSmartModel from "@/library/z-eventbus";
import { PublicController } from "@/controllers";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    "modal-totp": () => import("@/layouts/desktop/modal/_modal_totp.vue")
  }
})
export default class AssetsHistoryRow extends Vue {
  @Prop() readonly record!: ZTypes.Withdraw | ZTypes.Deposit;
  @Prop() readonly type!: "deposit" | "withdraw";
  txid_box_opening = false;

  get currency() {
    return PublicController.currencies.find(
      currency => currency.id == this.record.currency
    );
  }

  get network() {
    return this.currency.networks.find(network => network.blockchain_key == this.record.blockchain_key)
  }

  mounted() {
    ZSmartModel.on("open-txid-box", () => {
      this.close_txid_box();
    });
  }

  beforeDestroy() {
    ZSmartModel.remove("open-txid-box", () => {
      this.close_txid_box();
    });
  }

  getDate(date) {
    return helpers.getDate(date, true);
  }

  open_txid_box() {
    ZSmartModel.emit("open-txid-box");
    this.$nextTick(() => {
      this.txid_box_opening = true;
    });
  }

  close_txid_box() {
    this.txid_box_opening = false;
  }

  change_txid_box() {
    this.txid_box_opening ? this.close_txid_box() : this.open_txid_box();
  }

  open_confirm_modal() {
    (this.$parent.$refs["modal-confirm-withdrawal"] as any).create(this.record);
  }
}
</script>
