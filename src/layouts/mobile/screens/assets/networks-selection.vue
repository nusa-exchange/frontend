<template>
  <div class="networks-selection">
    <span
      v-for="network in networks"
      :key="network.blockchain_key"
      :class="['networks-selection-item', { 'networks-selection-item-active': value == network.blockchain_key }]"
      @click="$emit('input', network.blockchain_key)"
    >
      {{ network.protocol }}
    </span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class NetworksSelection extends Vue {
  @Prop() readonly currency!: ZTypes.Currency;
  @Prop() readonly value!: string;

  get networks() {
    return this.currency.networks;
  }
}
</script>

<style lang="less">
.networks-selection {
  position: relative;
  width: 100%;
  padding: 0 8px;
  font-size: 12px;
  font-weight: 500;
  margin-top: 8px;
  display: flex;

  &-item {
    border-radius: 2px;
    padding: 2px 6px;
    border: 1px solid var(--border-color);
    margin-right: 8px;
    cursor: pointer;

    &-active {
      background-color: var(--blue-color);
      border-color: var(--blue-color);
    }
  }
}
</style>
