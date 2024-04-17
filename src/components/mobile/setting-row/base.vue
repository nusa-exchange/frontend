<template>
  <div class="setting-row" v-wave="clickable" @click="$emit('click')">
    <div class="setting-row-content">
      <a-icon v-if="icon" :type="icon" />
      <span class="setting-row-title">
        <slot />
      </span>
    </div>
    <div class="setting-row-value">
      <span>{{ value }}</span>

      <div v-if="clickable" class="setting-row-action">
        <a-icon type="right" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class SettingRow extends Vue {
  @Prop() readonly icon!: string;
  @Prop() readonly value!: string;
  @Prop({ default: true }) readonly clickable!: boolean;
}
</script>

<style lang="less">
.setting-row {
  position: relative;
  height: 40px;
  line-height: 40px;
  width: 100%;
  padding: 0 12px;
  display: block;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-card-color);

  &-content {
    font-size: 10px;
  }

  &-title {
    margin-left: 4px;
    font-size: 12px;
  }

  &-value {
    position: absolute;
    top: 0;
    right: 12px;
    height: 100%;
    color: var(--color-gray);
    font-size: 10px;
    display: flex;
  }

  &-action {
    line-height: 1;
    margin: auto;
  }

  i {
    color: var(--color-gray);
    vertical-align: text-bottom;
    font-size: 16px;
  }
}
</style>
