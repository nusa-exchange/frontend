<template>
  <button
    class="z-auth-button"
    :type="type"
    :disabled="disabled || loading"
    @click="onSubmit"
  >
    <template v-if="loading">
      <a-icon type="loading" style="font-size: 12px" spin />
      Loading
    </template>
    <slot v-else />
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class AuthButton extends Vue {
  @Prop() readonly loading!: boolean;
  @Prop() readonly type!: string;
  @Prop() readonly disabled!: boolean;

  onSubmit($event) {
    if (this.loading || this.disabled) return;

    this.$emit("click", $event);
  }
}
</script>

<style lang="less">
.z-auth-button {
  width: 100%;
  height: 35px;
  font-size: 12px;
  font-weight: 500;
  background-color: var(--blue-color);

  &:disabled {
    background-color: var(--disabled-color);
  }
}
</style>
