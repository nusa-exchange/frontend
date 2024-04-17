<template>
  <p
    :style="{
      backgroundSize:
        (((price * amount) / maxTotal) * 100).toFixed(0) +
        '% 100%'
    }"
  >
    <span
      :class="['text-left', trendType(side)]"
      v-text="getPrice(price)"
    />
    <span class="text-right" v-text="getAmount(amount)" />
  </p>
</template>

<script lang="ts">
import { MarketMixin } from "@/mixins/mobile";
import { Vue, Component, Mixins, Prop } from "vue-property-decorator";

@Component
export default class DepthRow extends Mixins(MarketMixin){
  @Prop() readonly market_id!: string;
  @Prop() readonly side!: ZTypes.TakerType;
  @Prop() readonly maxTotal!: number;
  @Prop() readonly price!: number;
  @Prop() readonly amount!: number;
}
</script>
