<template>
  <div class="assets-preview-tab-bar">
    <div
      v-for="tab in tabs"
      :key="tab.key"
      class="assets-preview-tab-bar-item"
      @click="onTabClick(tab.key)"
    >
      <div class="assets-preview-tab-bar-icon">
        <a-icon :type="tab.icon" />
      </div>
      <div>{{ tab.text }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class PreviewTabBar extends Vue {
  tabs = [
    {
      icon: "download",
      key: "deposit",
      text: "Deposit"
    },
    {
      icon: "upload",
      key: "withdraw",
      text: "Withdraw"
    }
  ];

  onTabClick(key) {
    this.$emit("click", key);
  }
}
</script>

<style lang="less">
.assets-preview-tab-bar {
  background-color: var(--bg-card-color);
  padding: 4px;

  &-item {
    line-height: 20px;
    line-height: 1;
    margin: 2px 0;
  }

  &-icon {
    height: 20px;
    width: 20px;
    line-height: 20px;
    margin-left: auto;
    margin-right: auto;
    color: var(--blue-color);
    font-size: 12px;
    background-color: var(--bg-head-color);
    border-radius: 20px;
    margin-bottom: 4px;
  }
}
</style>
