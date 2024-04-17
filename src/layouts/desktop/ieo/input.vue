<template>
  <div class="ieo-input">
    <auth-input type="text" :placeholder="placeholder" :placeholderNeed="placeholderNeed" :value="value" @input="onInput" :error="error" :disabled="disabled" @focus="$emit('focus')" @blur="$emit('blur')">
      <template v-if="$slots['right-action']" slot="right-action">
        <slot name="right-action" />
      </template>
    </auth-input>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: {
    "auth-input": () => import("@/components/desktop/auth-input.vue")
  }
})
export default class Input extends Vue {
  @Prop() readonly value: string;
  @Prop() readonly placeholder: string;
  @Prop() readonly placeholderNeed: boolean;
  @Prop() readonly error: string;
  @Prop() readonly disabled: boolean;

  onInput(value: string) {
    const value_with_split = value.split(".");
    const n1 = value_with_split[0];
    const n2 = value_with_split[1];

    if (value_with_split.length >= 3) {
      this.$emit('input', [n1, n2].join("."));
      this.$forceUpdate();
      return;
    };

    const isNumberRegex = /^[0-9]*$/;

    if (n1.length === 0) {
      this.$emit('input', '');
    } else if (isNumberRegex.test(n1) && !n2) {
      this.$emit('input', value);
    } else if (isNumberRegex.test(n1) && isNumberRegex.test(n2)) {
      this.$emit('input', [n1, n2].join("."));
    } else {
      this.$emit('input', this.value);
    }

    this.$forceUpdate();
  }
}
</script>

<style lang="less">
.ieo-input {
  .z-auth-input-placeholder-on {
    background-color: var(--bg-head-color);
  }
}
</style>