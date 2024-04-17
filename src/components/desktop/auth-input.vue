<template>
  <div :class="['z-auth-input', { 'z-auth-input-error': !!error, 'z-auth-input-disabled': disabled }]">
    <input
      v-if="['text', 'password'].includes(input_type)"
      ref="input"
      :value="value_input"
      :name="name"
      :type="input_type"
      autocomplete="off"
      autocorrect="off"
      spellcheck="off"
      autocapitalize="none"
      :maxlength="maxlength"
      :disabled="disabled"
      @focus="onInputFocus"
      @blur="onInputBlur"
      @input="onInputChange"
    />
    <a-select v-else-if="input_type == 'select'" dropdownClassName="z-auth-input-dropdown" @change="onSelectChange">
      <a-select-option v-for="(v, k) in select" :key="k" :value="k">
        {{ v }}
      </a-select-option>
    </a-select>
    <div v-if="$slots['right-action']" class="z-auth-input-right-action">
      <slot name="right-action" />
    </div>
    <span
      v-if="placeholder"
      :class="[
        'z-auth-input-placeholder',
        { 'z-auth-input-placeholder-on': input_focus || value_input.length }
      ]"
      @click="onPlaceholderClick"
    >
      {{ placeholder }}
      <span
        v-if="input_focus || value_input.length"
        class="z-auth-input-placeholder-need"
      >
        {{ placeholderNeed ? "*" : "(optional)" }}
      </span>
    </span>
    <span v-if="error" class="z-auth-input-error-content">
      {{ error }}
    </span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class App extends Vue {
  @Prop({ default: "" }) public readonly value!: string;
  @Prop() public readonly name!: string;
  @Prop() public readonly placeholder!: string;
  @Prop({ default: false }) public readonly placeholderNeed!: boolean;
  @Prop() public readonly maxlength!: string | number;
  @Prop({ default: "text" }) public readonly type!: "text" | "number" | "select";
  @Prop() public readonly prefix!: string;
  @Prop() public readonly error!: string;
  @Prop() public readonly select!: { [key: string]: string };
  @Prop() public readonly disabled!: boolean;

  public $refs: {
    input: HTMLInputElement;
  };
  public input_focus = false;

  get value_input() {
    return (this.prefix || "") + this.value;
  }

  get input_type() {
    const { type } = this;

    return type === "number" ? "text" : type;
  }

  public onInputFocus() {
    this.input_focus = true;
    this.$emit("focus");
  }

  public onInputBlur() {
    this.input_focus = false;
    this.$emit("blur");
  }

  public onInputChange(event) {
    let value: string = event.target.value;
    if (this.prefix) {
      value = value.replace(this.prefix, "");
    }
    if (this.type === "number") {
      value = value.replace(/[^\d]/, "");
    }
    if (this.maxlength) {
      value = value.substring(0, Number(this.maxlength));
    }

    this.$emit("input", value);
    this.update_component();
  }

  public onSelectChange(value: string) {
    this.$emit("input", value);
    this.update_component();
  }

  public update_component() {
    this.$nextTick(() => {
      this.$forceUpdate();
    });
  }

  public onPlaceholderClick() {
    this.$nextTick(() => this.$refs.input.focus());
  }
}
</script>

<style lang="less">
@input-prefix-cls: ~"z-auth-input";
@input-height: 50px;

.@{input-prefix-cls} {
  position: relative;

  & + & {
    margin-top: 20px;
  }

  input {
    height: @input-height;
    width: 100%;
    border: 1px solid;
    border-color: var(--border-color);
    padding: 0 20px;
    font-size: 14px;
    caret-color: var(--blue-color);
    z-index: 1;

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      box-shadow: 0 0 0 1000px var(--bg-card-color) inset !important;
      -webkit-text-fill-color: var(--text-default-color) !important;
    }

    &:disabled {
      cursor: not-allowed;
    }
  }

  &-disabled {
    cursor: not-allowed;
  }

  .ant-select {
    height: @input-height;
    width: 100%;
  }

  .ant-select-selection {
    height: @input-height;
    line-height: @input-height;
    width: 100%;
    border: 1px solid;
    border-color: var(--border-color);
    padding: 0 20px;
    font-size: 14px;
    border-radius: 0;
    box-shadow: none;
    background-color: transparent;

    &__rendered {
      height: @input-height;
      line-height: @input-height;
      margin: 0;
    }

    i {
      color: var(--color-gray);
    }
  }

  &-dropdown {
    border-radius: 0;
    border-color: var(--border-color);
    box-shadow: none;

    .ant-dropdown-menu-item-selected,
    .ant-select-dropdown-menu-item-selected,
    .ant-dropdown-menu-item:hover,
    .ant-select-dropdown-menu-item:hover,
    .ant-dropdown-menu-item-selected a,
    .ant-select-dropdown-menu-item-selected a {
      background-color: var(--bg-color) !important;
    }

    .ant-select-dropdown-menu {
      background-color: var(--bg-card-color);
    }
  }

  &-right-action {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;

    button {
      background-color: var(--color-gray);
      border-radius: 4px;

      &:disabled {
        cursor: not-allowed;
        background-color: var(--disabled-color);
      }
    }
  }

  &-placeholder {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    padding: 0 4px;
    color: var(--color-gray);
    transition: all 0.2s;
    z-index: 0;
    cursor: text;

    &-on {
      top: 0;
      left: 14px;
      background-color: var(--bg-card-color);
      color: #fff;
    }
  }

  &-error {
    input {
      border-color: var(--down-color);
    }

    .@{input-prefix-cls} {
      &-placeholder {
        color: var(--down-color);
      }
    }

    &-content {
      color: var(--down-color);
    }
  }
}
</style>
