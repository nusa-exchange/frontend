<template>
  <div class="assets-input">
    <auth-input
      type="text"
      :value="value"
      @input="onInputChange"
      :placeholder="placeholder"
      :title="title"
    >
      <template v-if="$slots['right']" slot="right">
        <slot name="right" />
      </template>
      <template v-if="$slots['action']" slot="action">
        <slot name="action" />
      </template>
    </auth-input>
    <div v-if="note" class="assets-input-note">
      {{ note }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    "auth-input": () => import("@/components/mobile/auth-input")
  }
})
export default class AssetsInput extends Vue {
  @Prop() readonly value!: string;
  @Prop() readonly type!: "text" | "number";
  @Prop() readonly placeholder!: string;
  @Prop() readonly title!: string;
  @Prop() readonly note!: string;

  onInputChange(value: string) {
    this.$emit("input", value);
  }
}
</script>

<style lang="less">
.assets-input-note {
  margin-top: 4px;
  font-size: 8px;
  color: var(--color-gray);
}
</style>
