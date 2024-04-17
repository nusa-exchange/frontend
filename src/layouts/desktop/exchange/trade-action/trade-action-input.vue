<template>
  <div
    :class="['trade-action-input', { 'trade-action-input-error': error, 'trade-action-input-disabled': disabled }]"
    @mouseover="mouseover"
    @mouseleave="mouseleave"
  >
    <a-tooltip :visible="!!error && allow_tooltip">
      <template slot="title">
        {{ error }}
      </template>
      <span v-if="prefix" class="trade-action-input-prefix">{{ prefix }}</span>
      <finput
        :value="value"
        type="text"
        :disabled="disabled"
        @input="onInputChange"
        @focus="onInputFocus"
        @blur="onInputBlur"
      />
      <span v-if="suffix" class="trade-action-input-suffix">{{ suffix }}</span>
      <div
        v-if="input_focus && value && estimateValue && !error"
        class="trade-action-input-estimate"
      >
        ≈ {{ estimateValue }} USD
      </div>
    </a-tooltip>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    finput: () => import("./finput.vue")
  }
})
export default class App extends Vue {
  @Prop() readonly value!: string;
  @Prop() readonly prefix!: string;
  @Prop() readonly suffix!: string;
  @Prop() readonly estimateValue!: string;
  @Prop({ default: false }) readonly estimate!: boolean;
  @Prop() readonly error!: boolean;
  @Prop() readonly disabled!: boolean;

  allow_tooltip = false;
  input_error_class = "ant-input-error";
  input_focus = false;

  onInputChange(value) {
    this.input_focus = true;

    const value_with_split = value.split(".");
    const n1 = value_with_split[0];
    const n2 = value_with_split[1];

    if (value_with_split.length >= 3) {
      this.$emit('input', [n1, n2].join("."));
      return;
    };

    const isNumberRegex = /^[0-9]*$/;

    if (n1.length === 0) {
      this.$emit('input', '');
    } else if (isNumberRegex.test(n1) && !n2) {
      this.$emit('input', value);
    } else if (isNumberRegex.test(n1) && isNumberRegex.test(n2)) {
      this.$emit('input', value);
    }
  }

  onInputFocus() {
    this.input_focus = true;
  }

  onInputBlur() {
    this.input_focus = false;
  }
  mouseover() {
    this.allow_tooltip = true;
  }

  mouseleave() {
    this.allow_tooltip = false;
  }
}
</script>

<style lang="less">
.trade-action-input {
  position: relative;
  border: 1px solid;
  border-radius: 4px;
  border-color: var(--border-color);

  input {
    height: 35px;
    width: 100%;
    border: none;
    padding: 0 75px !important;
    text-align: right;

    &:disabled {
      cursor: not-allowed;
    }
  }

  &-disabled {
    background-color: var(--bg-downdown-color);
    cursor: not-allowed;
  }

  &-error {
    .trade-action-input {
      &-prefix,
      &-suffix {
        color: var(--down-color);
      }
    }

    input {
      background-color: #f356562b !important;
      border-color: #ef4d4d !important;
    }
  }

  &-prefix,
  &-suffix {
    color: var(--color-gray);
    position: absolute;
    font-size: 12px;
    top: 50%;
    transform: translateY(-50%);
  }

  &-prefix {
    left: 16px;
  }

  &-suffix {
    right: 16px;
  }

  &-estimate {
    width: 100%;
    position: absolute;
    bottom: -8px;
    left: 0;
    border-radius: 0 0 3px 3px;
    height: 14px;
    line-height: 14px;
    font-size: 11px;
    background-color: #0095ff;
    padding-left: 16px;
    color: white;
  }
}
</style>
