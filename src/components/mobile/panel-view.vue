<template>
  <transition name="panel-move">
    <div v-if="isActive" class="panel-view">
      <slot />
    </div>
  </transition>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class PanelView extends Vue {
  isActive = false;

  mounted() {
    (this.$parent as any).PanelView = this;
  }
}
</script>

<style lang="less">
@import "~@/assets/css/components/panel-view";
</style>
