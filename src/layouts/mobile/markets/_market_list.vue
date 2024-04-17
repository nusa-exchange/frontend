<template>
  <div
    class="body-bar z-table z-table-no-scroll"
    :style="{ height: `${height}px` }"
  >
    <div class="z-table-head">
      <span class="text-left">Pair / Vol</span>
      <span class="text-right">Last Price</span>
      <span class="text-right">24h Chg%</span>
    </div>
    <cube-slide
      ref="slide"
      :allow-vertical="true"
      :loop="false"
      :initial-index="initialIndex"
      :auto-play="false"
      :show-dots="false"
      :options="{
        listenScroll: true,
        probeType: 3,
        directionLockThreshold: 0
      }"
      @scroll="scroll"
      @change="changePage"
    >
      <cube-slide-item
        v-for="item in list_bid"
        :key="item.label"
        :label="item.label"
      >
        <div class="z-table-content">
          <market-row
            v-for="market in findTickers('market', item.label)"
            :key="market.id"
            :market_id="market.id"
            @click="$emit('click', market)"
          />
        </div>
      </cube-slide-item>
    </cube-slide>
  </div>
</template>

<script lang="ts">
import { MarketMixin } from "@/mixins/mobile";
import { Mixins, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    "market-row": () => import("@/components/mobile/market-row")
  }
})
export default class MarketList extends Mixins(MarketMixin) {
  @Prop() readonly height!: number;

  $refs!: {
    [key: string]: any;
  };

  get tab_nav(): any {
    return this.head_bar.$refs["tab-nav"];
  }

  get head_bar(): any {
    return this.$parent.$children.find(children => children.$refs["tab-nav"]);
  }

  get list_bid(): { label: string }[] {
    return this.head_bar.list_bid;
  }

  get initialIndex() {
    const index = this.list_bid.findIndex(
      bid =>
        bid.label.toLowerCase() === this.head_bar.selectedLabel.toLowerCase()
    );
    return index;
  }

  scroll(pos) {
    const index = this.initialIndex;
    const tab_width: number = this.tab_nav.tabs[index].$el.offsetWidth;
    const x = Math.abs(pos.x);
    const tabItemWidth = this.tab_nav.$el.clientWidth;
    const slideScrollerWidth = this.$refs.slide.slide.scrollerWidth;
    const deltaX = (x / slideScrollerWidth) * tabItemWidth + tab_width / 2 - 8;

    this.tab_nav.setSliderTransform(deltaX);
  }

  changePage(index) {
    this.head_bar.selectedLabel = this.list_bid[index].label;
  }
}
</script>
