<template>
  <panel-view class="screen-assets screen-assets-history">
    <head-bar title="History" @back="destroy" />
    <z-page-slide v-model="slide_key" :slide_items="SLIDE_ITEM">
      <template slot="deposit">
        <deposit-history />
      </template>
      <template slot="withdrawal">
        <withdrawal-history />
      </template>
    </z-page-slide>

    <assets-history-details ref="assets-history-details" />
  </panel-view>
</template>

<script lang="ts">
import ZSmartModel from "@/library/z-eventbus";
import { ScreenMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";

@Component({
  components: {
    "z-page-slide": () => import("@/components/mobile/z-page-slide"),
    "deposit-history": () => import("./deposit.vue"),
    "withdrawal-history": () => import("./withdrawal.vue"),
    "assets-history-details": () => import("./details.vue")
  }
})
export default class ScreenAssetsHistory extends Mixins(ScreenMixin) {
  slide_key = "";

  get SLIDE_ITEM() {
    return [
      {
        key: "deposit",
        label: "Deposit",
        value: "deposit"
      },
      {
        key: "withdrawal",
        label: "Withdrawal",
        value: "withdrawal"
      }
    ];
  }

  before_panel_create(type: string) {
    this.slide_key = type;

    ZSmartModel.on(
      "open-assets-history-details",
      this.open_assets_history_details_screen
    );
  }

  open_assets_history_details_screen(
    type: string,
    record: ZTypes.Deposit | ZTypes.Withdraw
  ) {
    (this.$refs["assets-history-details"] as any).create({ type, record });
  }

  before_panel_destroy() {
    ZSmartModel.on(
      "open-assets-history-details",
      this.open_assets_history_details_screen
    );
  }
}
</script>
