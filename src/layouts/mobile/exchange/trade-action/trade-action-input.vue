<template>
  <div class="trade-action-input">
    <div class="trade-action-input-action minus" @click="onMinusClick">
      <a-icon type="minus" />
    </div>
    <input
      type="text"
      :value="value"
      :placeholder="placeholder"
      @input="onInputChange"
    />
    <div class="trade-action-input-action plus" @click="onPlusClick">
      <a-icon type="plus" />
    </div>
  </div>
</template>

<script lang="ts">
import * as helpers from "@/library/z-helpers";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class TradeActionInput extends Vue {
  @Prop() readonly value!: string;
  @Prop() readonly placeholder!: string;
  @Prop() readonly precision!: number;
  @Prop({ default: 0 }) readonly value_minimum!: number;
  @Prop() readonly value_maximum!: number;

  get min_amount() {
    const { precision } = this;

    return Number(["0", [Array(precision).join("0") + "1"]].join("."));
  }

  onMinusClick() {
    const value = (Number(this.value) - this.min_amount).toFixedNumber(
      this.precision
    );
    if (value < this.value_minimum) {
      this.commit_value((0).toString());
      return;
    }

    this.commit_value(value.toString());
  }

  onPlusClick() {
    const value = (Number(this.value) + this.min_amount).toFixedNumber(
      this.precision
    );
    if (value >= this.value_maximum) return;

    this.commit_value(value.toString());
  }

  onInputChange(event) {
    const { value } = event.target;
    this.commit_value(value);
  }

  commit_value(value: string) {
    value = helpers.inputOnlyNumber(value, this.precision);

    this.$emit("input", value);
    this.update_component();
  }

  update_component() {
    this.$nextTick(() => {
      this.$forceUpdate();
    });
  }

  @Watch("value")
  public onValueChanged(value: string) {
    this.commit_value(value);
  }
}
</script>
