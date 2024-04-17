<template>
  <div class="assets-history-withdrawal">
    <z-pull
      ref="pull"
      :loading="loading"
      :data="data"
      :pull-down-refresh="true"
      :pull-up-refresh="true"
      :no-more="noMore"
      @pulling-down="onPullingDown"
      @pulling-up="onPullingUp"
    >
      <history-row
        v-for="(withdraw, index) in data"
        :key="index"
        :record="withdraw"
        @click="onHistoryRowClick(withdraw)"
      />
    </z-pull>
  </div>
</template>

<script lang="ts">
import ZSmartModel from "@/library/z-eventbus";
import { PullMixin } from "@/mixins/mobile";
import { Mixins, Component } from "vue-property-decorator";

@Component({
  components: {
    "z-pull": () => import("@/components/mobile/z-pull"),
    "history-row": () => import("./history-row.vue")
  }
})
export default class ScreenAssetsHistoryWithdrawal extends Mixins(PullMixin) {
  async fetch_data(page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    try {
      const { data } = await this.TradeController.get_withdraws({
        limit: pageSize,
        page: page
      });

      this.page = page;
      this.pageSize = pageSize;

      return data;
    } catch (error) {
      return error;
    } finally {
      this.loading = false;
    }
  }

  onHistoryRowClick(withdraw: ZTypes.Deposit) {
    ZSmartModel.emit("open-assets-history-details", "withdrawal", withdraw);
  }
}
</script>

<style lang="less">
.assets-history-withdrawal {
  height: 100%;
  padding: 0 12px;
}
</style>
