<template>
  <div>
    <span class="text-left" :class="trendType(side)">
      --
    </span>
    <span class="text-right">
      --
    </span>
  </div>
</template>

<script lang="ts">
import { MarketMixin } from "@/mixins/mobile";
import { Vue, Component, Prop, Mixins } from "vue-property-decorator";

@Component
export default class DepthRow extends Mixins(MarketMixin) {
  @Prop() readonly side!: ZTypes.TakerType;
}
</script>
