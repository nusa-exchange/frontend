<template>
  <z-content class="page-markets-m">
    <head-bar ref="head-bar" @click="open_search_screen" />
    <market-list
      ref="market-list"
      :height="body_bar_height"
      @click="open_market_preview_screen"
    />

    <screen-search-markets
      ref="screen-search-markets"
      @click="open_market_preview_screen"
    />
    <screen-market-preview ref="screen-market-preview" />
  </z-content>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "head-bar": () => import("@/layouts/mobile/markets/_head_bar.vue"),
    "market-list": () => import("@/layouts/mobile/markets/_market_list.vue"),
    "screen-market-preview": () =>
      import("@/views/mobile/screens/market-preview"),
    "screen-search-markets": () =>
      import("@/views/mobile/screens/search-markets")
  }
})
export default class Markets extends Vue {
  $refs!: {
    [key: string]: any;
  };

  search = "";

  body_bar_height = 0;

  get height() {
    return this.$el.clientHeight;
  }

  get head_bar_height() {
    return this.$refs["head-bar"].$el.clientHeight;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  mounted() {
    this.$nextTick(async () => {
      while (true) {
        if (
          !(this.height && this.$refs["head-bar"] && this.$refs["market-list"])
        ) {
          await this.sleep(10);
          continue;
        }

        this.body_bar_height = this.height - this.head_bar_height;

        await this.sleep(10);
      }
    });
  }

  open_market_preview_screen(market: ZTypes.Market) {
    this.$refs["screen-market-preview"].create(market.id);
  }

  open_search_screen() {
    this.$refs["screen-search-markets"].create();
  }
}
</script>

<style lang="less">
@import "~@/assets/css/views/mobile/markets";

.page-markets-m {
  .z-table {
    height: auto;
    min-height: auto;
    padding-bottom: 0;

    &-head {
      line-height: 25px;
      padding: 0 16px;
    }

    .cube-slide {
      height: calc(100% - 20px);
    }

    &-content {
      height: 100%;
    }

    &-row {
      padding-left: 16px;
      padding-right: 16px;
    }
  }
}
</style>
