<template>
  <div class="orders-screen-content">
    <cube-slide
      ref="slide"
      :allow-vertical="true"
      :loop="false"
      :initial-index="initial_index"
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
        v-for="item in TYPE_LABEL"
        :key="item.key"
        :label="item.label"
      >
        <open-orders v-if="item.key == 'open_orders'" />
        <orders-history v-if="item.key == 'orders_history'" />
        <trades-history v-if="item.key == 'trades_history'" />
      </cube-slide-item>
    </cube-slide>
  </div>
</template>

<script lang="ts">
import HeadBar from "./head-bar.vue";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    "open-orders": () => import("./open_orders.vue"),
    "orders-history": () => import("./orders_history.vue"),
    "trades-history": () => import("./trades_history.vue")
  }
})
export default class OrdersScreen extends Vue {
  $refs!: {
    [key: string]: any;
  };

  window_width: number;

  get selected_key() {
    return this.TYPE_LABEL[this.initial_index].key;
  }

  get tab_nav(): any {
    return this.head_bar.$refs["tab-nav"];
  }

  get head_bar() {
    return this.$parent.$children.find(
      children => children.$refs["tab-nav"]
    ) as HeadBar;
  }

  get TYPE_LABEL() {
    return this.head_bar.TYPE_LABEL;
  }

  get initial_index() {
    const index = this.TYPE_LABEL.findIndex(
      type => type.label === this.head_bar.selected_label
    );
    return index;
  }

  mounted() {
    (this
      .$el as HTMLElement).style.height = `calc(100% - ${this.head_bar.$el.clientHeight}px)`;
  }

  scroll(pos) {
    const index = this.initial_index;
    const tab_width: number = this.tab_nav.tabs[index].$el.offsetWidth;
    const x = Math.abs(pos.x);
    const tabItemWidth = this.tab_nav.$el.clientWidth;
    const slideScrollerWidth = this.$refs.slide.slide.scrollerWidth;
    const deltaX =
      (x / (slideScrollerWidth + 16)) * tabItemWidth + tab_width / 2 - 8;

    this.tab_nav.setSliderTransform(deltaX);
  }

  changePage(index) {
    this.head_bar.selected_label = this.TYPE_LABEL[index].label;
  }
}
</script>
