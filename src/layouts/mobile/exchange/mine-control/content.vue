<template>
  <div class="page-exchange-m-orders-content">
    <div
      class="pairs-choose"
      :class="{ 'pairs-choose-hide': hide_other_pairs }"
    >
      <span @click="hide_other_pairs = !hide_other_pairs">
        <a-icon type="check-circle" theme="filled" /> Hide other pairs
      </span>
    </div>
    <order-row
      v-for="order in orders_filter.slice(0, 10)"
      :key="order.id"
      :order="order"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    "order-row": () => import("@/components/mobile/order-row")
  }
})
export default class MineControlContent extends Vue {
  @Prop() readonly orders!: ZTypes.Order[];

  hide_other_pairs = false;

  get orders_filter() {
    return this.orders.filter(order =>
      this.hide_other_pairs
        ? order.market == this.TradeController.market.id
        : true
    );
  }

  get element() {
    return this.$el as HTMLElement;
  }

  mounted() {
    this.$nextTick(() => {
      this.set_content_height();
    });
  }

  set_content_height() {
    const DOMRect = this.element.getBoundingClientRect();

    this.element.style.height = `${document.body.clientHeight -
      50 -
      DOMRect.top}px`;
  }
}
</script>
