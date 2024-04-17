<template>
  <div
    class="z-loading"
    :style="{ height: `${height}px`, width: `${width}px` }"
  >
    <a-spin>
      <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
    </a-spin>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { ResizeObserver } from 'resize-observer';

@Component
export default class ZLoading extends Vue {
  width = 0;
  height = 0;
  loop: NodeJS.Timeout;
  resize_observer: ResizeObserver;

  get parentElement() {
    return this.$el.parentElement;
  }

  mounted() {
    this.set_height_width();
    this.resize_observer = new ResizeObserver(() => {
      this.set_height_width();
    });
    this.resize_observer.observe(this.parentElement);
  }

  set_height_width() {
    this.height = this.parentElement.clientHeight;
    this.width = this.parentElement.clientWidth;
  }
}
</script>

<style lang="less">
.z-loading {
  position: absolute;
  left: 0;
  top: 0;
  background-color: var(--bg-card-color);
  z-index: 999;
}
</style>
