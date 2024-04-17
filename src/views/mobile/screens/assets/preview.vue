<template>
  <panel-view class="screen-assets-preview assets-preview">
    <head-bar
      ref="head-bar"
      :title="currency.id.toUpperCase()"
      @back="destroy"
    />
    <assets-row ref="assets-row" :currency="currency" :action-disabled="true" />
    <div
      class="assets-transaction"
      :style="{ height: `${assets_transaction_height}px` }"
    >
      <z-empty />
    </div>
    <assets-preview-tab-bar ref="tab-bar" @click="onTabBarClick" />
  </panel-view>
</template>

<script lang="ts">
import { ScreenMixin } from "@/mixins/mobile";
import { Vue, Component, Mixins } from "vue-property-decorator";
import { PublicController } from "@/controllers";

@Component({
  components: {
    "assets-row": () => import("@/layouts/mobile/assets/assets-row.vue"),
    "assets-preview-tab-bar": () =>
      import("@/layouts/mobile/screens/assets/preview/tab-bar.vue")
  }
})
export default class AssetsPreviewScreen extends Mixins(ScreenMixin) {
  $refs!: {
    "head-bar": Vue;
    "assets-row": Vue;
    "tab-bar": Vue;
    "assets-transaction": Element;
  };

  currency = PublicController.currencies[0];

  assets_transaction_height = 0;

  get height() {
    return this.$el.clientHeight;
  }

  get head_bar_height() {
    return this.$refs["head-bar"].$el.clientHeight;
  }

  get assets_row_height() {
    return this.$refs["assets-row"].$el.clientHeight;
  }

  get tab_bar_height() {
    return this.$refs["tab-bar"].$el.clientHeight;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  before_panel_create(currency: ZTypes.Currency) {
    this.currency = currency;
  }

  panel_created() {
    this.$nextTick(async () => {
      while (true) {
        if (
          !(
            this.height &&
            this.$refs["head-bar"] &&
            this.$refs["assets-row"] &&
            this.$refs["tab-bar"]
          )
        ) {
          await this.sleep(10);
          continue;
        }

        this.assets_transaction_height =
          this.height -
          this.head_bar_height -
          this.assets_row_height -
          this.tab_bar_height;

        await this.sleep(10);
      }
    });
  }

  onTabBarClick(type: string) {
    this.$emit("click", type, this.currency);
  }
}
</script>

<style lang="less">
.screen-assets-preview {
  .assets-row {
    padding-left: 12px;
    padding-right: 12px;
  }

  .assets-transaction {
    overflow: auto;

    .ant-empty {
      margin-top: 35px;
    }
  }

  .assets-preview-tab-bar {
    display: flex;
    position: fixed;
    bottom: 0;
    width: 100%;

    &-item {
      flex: 1;
      text-align: center;
    }
  }
}
</style>
