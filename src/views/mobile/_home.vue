<template>
  <z-content class="page-home-m pull-content">
    <HeadBar
      @user-click="open_user_screen"
      @search-click="open_search_market_screen"
    />
    <preview />
    <feature-markets @click="open_market_preview_screen" />
    <trend-top @click="open_market_preview_screen" />
    <screen-user ref="screen-user" />
    <screen-search-markets
      ref="screen-search-markets"
      @click="open_market_preview_screen"
    />
    <screen-market-preview ref="screen-market-preview" />
  </z-content>
</template>

<script lang="ts">
import HeadBar from "@/layouts/mobile/home/head-bar.vue";
import Preview from "@/layouts/mobile/home/preview.vue";
import FeatureMarkets from "@/layouts/mobile/home/feature-markets";
import TrendTop from "@/layouts/mobile/home/trend-top.vue";
import ZSmartModel from "@/library/z-eventbus";
import { MarketMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";

@Component({
  components: {
    HeadBar,
    Preview,
    FeatureMarkets,
    TrendTop,
    "screen-user": () => import("@/views/mobile/screens/user"),
    "screen-market-preview": () =>
      import("@/views/mobile/screens/market-preview"),
    "screen-search-markets": () =>
      import("@/views/mobile/screens/search-markets")
  }
})
export default class Home extends Mixins(MarketMixin) {
  $refs!: {
    [key: string]: any;
  };

  get isAuth() {
    return this.UserController.state == "active"
  }

  open_user_screen() {
    this.isAuth ? this.$refs["screen-user"].create() : ZSmartModel.emit("need-login", () => { 
      this.$refs["screen-user"].create();
     });
  }

  open_search_market_screen() {
    this.$refs["screen-search-markets"].create();
  }

  open_market_preview_screen(market: ZTypes.Market) {
    this.$refs["screen-market-preview"].create(market.id);
  }
}
</script>

<style lang="less">
@import "~@/assets/css/views/mobile/home";
</style>
