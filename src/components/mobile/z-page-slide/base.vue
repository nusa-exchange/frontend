<template>
  <div class="z-page-slide">
    <cube-tab-bar
      class="z-page-slide-tab-bar"
      ref="tab-nav"
      :value="value"
      show-slider
      :use-transition="true"
      :data="slide_items"
      @change="onTabBarChange"
    />
    <cube-slide
      class="z-page-slide-content"
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
      @change="onPageChange"
    >
      <cube-slide-item v-for="slide in slide_items" :key="slide.value">
        <slot :name="slide.value" />
      </cube-slide-item>
    </cube-slide>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ZPageSlide extends Vue {
  @Prop() readonly value!: string;
  @Prop({ default: () => [] }) readonly slide_items!: {
    label: string;
    value: string;
  }[];
  @Prop({ default: 35 }) readonly headBarHeight!: number;

  get initial_index() {
    return this.slide_items.findIndex(slide => slide.value == this.value);
  }

  get tab_nav(): any {
    return this.$refs["tab-nav"];
  }

  mounted() {
    const element = this.$el as HTMLElement;
    const slide_element = (this.$refs["slide"] as any).$el as HTMLElement;
    const tab_bar_element = (this.tab_nav as any).$el as HTMLElement;
    const tab_bar_height = tab_bar_element.clientHeight;

    element.style.height = `calc(100% - ${this.headBarHeight}px)`;
    slide_element.style.height = `calc(100% - ${tab_bar_height}px)`;
  }

  scroll(pos) {
    const index = this.initial_index;

    if (index < 0) return;

    const tab_width: number = this.tab_nav.tabs[index].$el.offsetWidth;
    const x = Math.abs(pos.x);
    const tabItemWidth = this.tab_nav.$el.clientWidth;
    const slideScrollerWidth = (this.$refs.slide as any).slide.scrollerWidth;
    const deltaX =
      (x / (slideScrollerWidth + 16)) * tabItemWidth + tab_width / 2 - 8;

    this.tab_nav.setSliderTransform(deltaX);
  }

  onTabBarChange(value) {
    this.$emit("input", value);
  }

  onPageChange(index) {
    this.$emit("input", this.slide_items[index].value);
  }
}
</script>
