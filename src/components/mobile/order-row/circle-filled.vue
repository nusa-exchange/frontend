<template>
  <div :class="['order-row-circle-filled', side]">
    <div class="type-side">Limit {{ side }}</div>
    <a-progress
      type="circle"
      :percent="filled"
      :width="width"
      :strokeWidth="strokeWidth"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class CircleFilled extends Vue {
  @Prop() readonly filled: number;
  @Prop() readonly side: ZTypes.OrderSide;

  width = 25;
  strokeWidth = 7;
}
</script>

<style lang="less">
.order-row-circle-filled {
  width: 50px;
}
</style>
