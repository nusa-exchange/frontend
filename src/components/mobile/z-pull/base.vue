<template>
  <cube-scroll
    ref="scroll"
    :data="data"
    :options="scrollOptions"
    nest-mode="native"
    @pulling-down="onPullingDown"
    @pulling-up="onPullingUp"
  >
    <template slot="pulldown" slot-scope="props">
      <div
        v-if="props.pullDownRefresh"
        class="cube-pulldown-wrapper"
        :style="props.pullDownStyle"
      >
        <div
          v-show="props.beforePullDown"
          class="before-trigger"
          :style="{
            paddingTop: props.bubbleY >= 30 ? '30px' : props.bubbleY + 'px'
          }"
        >
          <p>
            {{
              props.bubbleY > 60 - 30
                ? "Release to refresh"
                : "Pull down to refresh"
            }}
          </p>
          <p>
            Latest update:
            {{ getDate(latest_update) }}
          </p>
        </div>
        <div v-show="!props.beforePullDown" class="after-trigger">
          <div v-show="props.isPullingDown" class="loading">
            <a-icon type="loading" />
          </div>
          <div v-show="!props.isPullingDown" class="text">
            <span class="refresh-text">Refresh success</span>
          </div>
        </div>
      </div>
    </template>
    <template slot="pullup" slot-scope="props">
      <div v-if="props.pullUpLoad && data.length" class="cube-pullup-wrapper">
        <div class="after-trigger loading" v-if="props.isPullUpLoad">
          <a-icon type="loading" /> Loading
        </div>
        <div class="before-trigger" v-else-if="noMore">
          <span>No more data</span>
        </div>
        <div class="before-trigger" v-else>
          <a-icon type="loading" /> Loading
        </div>
      </div>
    </template>

    <template v-if="data.length" slot="default">
      <slot />
    </template>
    <template v-else-if="loading" slot="default">
      <z-loading />
    </template>
    <template v-else slot="default">
      <z-empty />
    </template>
  </cube-scroll>
</template>

<script lang="ts">
import { getDate } from "@/library/z-helpers";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class ZPull extends Vue {
  @Prop({ default: false }) readonly loading!: boolean;
  @Prop({ default: () => [] }) readonly data!: any[];
  @Prop({ default: false }) readonly pullDownRefresh!: boolean;
  @Prop({ default: false }) readonly pullUpRefresh!: boolean;
  @Prop({ default: false }) readonly noMore!: boolean;

  latest_update = new Date();

  get scrollOptions() {
    return {
      pullDownRefresh: this.pullDownRefresh
        ? {
            threshold: 60
          }
        : false,
      pullUpLoad: this.pullUpRefresh
        ? {
            threshold: 40
          }
        : false,
      bounce: {
        top: this.pullDownRefresh,
        bottom: this.pullUpRefresh,
        left: false,
        right: false
      }
    };
  }

  getDate(date: Date) {
    return getDate(date);
  }

  forceUpdate(dirty: boolean, nomore: boolean) {
    this.latest_update = new Date();

    (this.$refs.scroll as any).forceUpdate(dirty, nomore);
  }

  onPullingDown() {
    this.$emit("pulling-down", this.forceUpdate);
  }

  onPullingUp() {
    this.$emit("pulling-up", this.forceUpdate);
  }

  @Watch("noMore")
  onNoMoreChanged(noMore: boolean) {
    (this.$refs.scroll as any).scroll._cache = {
      pullUpLoad: !noMore
    };
    (this.$refs.scroll as any).scroll.options.bounce.bottom = !noMore;
  }
}
</script>

<style lang="less">
.cube-pulldown-wrapper .before-trigger {
  height: 30px;
}
</style>
