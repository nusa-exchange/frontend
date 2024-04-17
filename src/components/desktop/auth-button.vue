<template>
  <button
    class="z-auth-button"
    :type="type"
    :disabled="loading || disabled"
    @click="onSubmit"
  >
    <span v-if="loading">
      <a-icon type="loading" style="font-size: 24px" spin />
      Loading
    </span>
    <slot v-else />
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class App extends Vue {
  @Prop() public readonly loading!: boolean;
  @Prop() public readonly type!: string;
  @Prop() public readonly disabled!: boolean;

  onSubmit($event) {
    if (this.loading || this.disabled) return;

    this.$emit("click", $event);
  }
}
</script>

<style lang="less">
.z-auth-button {
  width: 100%;
  margin: 16px 0;
  height: 50px;
  line-height: 50px;
  background: var(--selected-blue-color);
  color: var(--text-default-color);
  text-align: center;
  font-size: 18px;

  &:hover {
    background: #1580cc;
  }
  &:disabled {
    background: rgb(98, 102, 111) !important;
  }
}
</style>
