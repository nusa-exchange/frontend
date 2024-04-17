<template>
  <div class="assets-history-deposit">
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
        v-for="(deposit, index) in data"
        :key="index"
        :record="deposit"
        @click="onHistoryRowClick(deposit)"
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
export default class ScreenAssetsHistoryDeposit extends Mixins(PullMixin) {
  async fetch_data(page = this.page, pageSize = this.pageSize) {
    this.loading = true;
    try {
      const { data } = await this.TradeController.get_deposits({
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

  onHistoryRowClick(deposit: ZTypes.Deposit) {
    ZSmartModel.emit("open-assets-history-details", "deposit", deposit);
  }
}
</script>

<style lang="less">
.assets-history-deposit {
  height: 100%;
  padding: 0 12px;
}
</style>
