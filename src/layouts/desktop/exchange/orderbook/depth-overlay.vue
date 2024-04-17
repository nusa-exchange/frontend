<template>
  <div class="depth-overlay">
    <div ref="overlay-mask" class="depth-overlay-mask" />
    <div
      v-show="mouse_event.hover && depth.filter(row => !row.fake)"
      ref="overlay-content"
      class="depth-overlay-content"
    >
      <template v-if="mouse_event.hover">
        <div class="depth-overlay-item avg-price">
          <span class="depth-overlay-title">{{ $t('page.exchange.depth.overlay.avg_price') }}:</span>
          <span class="depth-overlay-value">≈ {{ overlayData.avg_price }}</span>
        </div>
        <div class="depth-overlay-item">
          <span class="depth-overlay-title">
            {{ $t("page.global.table.sum") }} ({{ market.base_unit.toUpperCase() }}):
          </span>
          <span class="depth-overlay-value">{{ overlayData.sum_volume }}</span>
        </div>
        <div class="depth-overlay-item">
          <span class="depth-overlay-title">
            {{ $t("page.global.table.sum") }} ({{ market.quote_unit.toUpperCase() }}):
          </span>
          <span class="depth-overlay-value">{{ overlayData.sum_total }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { MarketMixin } from "@/mixins/mobile";
import { Mixins, Component, Prop } from "vue-property-decorator";

@Component
export default class DepthOverLay extends Mixins(MarketMixin) {
  @Prop() readonly side!: "asks" | "bids";
  @Prop() readonly depth: { price: string; amount: string }[];
  @Prop() orders_best_range?: (
    index: number
  ) => {
    price: string;
    amount: string;
  }[];

  $refs!: {
    "overlay-mask": HTMLElement;
    "overlay-content": HTMLElement;
  };

  mouse_event = {
    index: 0,
    hover: false
  };

  get style() {
    return (this.$el as HTMLElement).style;
  }

  get mask_style() {
    return this.$refs["overlay-mask"].style;
  }

  get content_style() {
    return this.$refs["overlay-content"].style;
  }

  get overlayData() {
    const orders_with_range = this.orders_best_range(
      this.mouse_event.index
    );

    if (!orders_with_range.length) {
      return {
        avg_price: 0,
        sum_volume: 0,
        sum_total: 0
      };
    }

    const avg_price = this.getPrice(
      orders_with_range.map(order => order.price).reduce((a, b) => Number(a) + Number(b), 0) /
        orders_with_range.length
    );
    const sum_volume = this.getAmount(
      orders_with_range.map(order => order.amount).reduce((a, b) => Number(a) + Number(b), 0)
    );
    const sum_total = this.getTotal(
      orders_with_range
        .map(order => Number(order.price) * Number(order.amount))
        .reduce((a, b) => a + b, 0)
    );

    return {
      avg_price,
      sum_volume,
      sum_total
    };
  }

  create(index: number, DOMRect: DOMRect) {
    this.mouse_event.index = index;
    this.mouse_event.hover = true;

    this.$nextTick(() => {
      this.overlay_created(index, DOMRect);
    });
  }

  overlay_created(index: number, DOMRect: DOMRect) {
    this.content_style.left = DOMRect.left.toString() + "px";
    this.content_style.top =
      (DOMRect.top + DOMRect.height / 2).toString() + "px";
    this.mask_style.height = `${
      this.side === "bids"
        ? DOMRect.height * ++index
        : DOMRect.height * (this.depth.length - index)
    }px`;
  }

  destroy() {
    this.mouse_event.hover = false;
    this.mask_style.height = "0";
  }
}
</script>

<style lang="less">
.depth-overlay {
  width: 100%;

  &-mask {
    background-color: var(--bg-downdown-color);
    position: absolute;
    left: 0;
    width: 100%;
  }

  &-content {
    position: fixed;
    transform: translateX(-101%) translateY(-50%);
    width: 320px;
    padding: 8px;
    background-color: var(--selected-bg-color);
    border-radius: 4px;
    z-index: 999;
  }

  &-item {
    font-size: 14px;
    line-height: 24px;
    font-weight: 500;
    padding: 4px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &-item.avg-price {
    font-size: 16px;
  }
}
</style>
