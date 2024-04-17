<template>
  <div :class="['z-card', { 'z-card-head-enabled': $slots['head'] || tabList }]">
    <div v-if="$slots['head'] && tabList" class="z-card-head">
      <a-tabs
        v-if="tabList"
        class="z-card-tabs"
        :activeKey="value"
        @change="onTabChange"
      >
        <a-tab-pane
          v-for="row in tabList"
          class="z-card-tab"
          :key="row.key"
          :tab="row.text"
        />
      </a-tabs>
      <slot name="head" />
    </div>
    <div v-else-if="$slots['head']" class="z-card-head">
      <slot name="head" />
    </div>
    <div v-else-if="tabList" class="z-card-head">
      <a-tabs
        v-if="tabList"
        class="z-card-tabs"
        :activeKey="value"
        @change="onTabChange"
      >
        <a-tab-pane
          v-for="row in tabList"
          class="z-card-tab"
          :key="row.key"
          :tab="row.text"
        />
      </a-tabs>
    </div>
    <div class="z-card-content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

type TabKey = string;

interface Tab {
  key: TabKey;
  text: string;
}

@Component
export default class ZCard extends Vue {
  @Prop() readonly tabList!: Tab[];
  @Prop() readonly value!: TabKey;

  onTabChange(tabKey: TabKey) {
    this.$emit("input", tabKey);
    this.$emit("change", tabKey);
  }
}
</script>

<style lang="less">
@card-prefix-cls:~"z-card";

.@{card-prefix-cls} {
  display: inline-block;
  background: var(--bg-card-color);

  &-head-enabled {
    > .@{card-prefix-cls}-content {
      height: calc(100% - 32px);
    }
  }

  &-head, &-content {
    position: relative;
  }

  &-head {
    display: flex;
    align-items: center;
    height: 32px;
    line-height: 32px;
    padding: 0 12px;
  }

  .ant-tabs-bar {
    margin: 0;
    border: none;

    .ant-tabs-tab {
      padding: 0;
      height: 32px;
      line-height: 32px;
      text-align: center;

      &:active {
        color: var(--blue-color) !important;
      }
    }
  }

  &-tabs {
    font-weight: 400;
    font-size: 14px;
  }

  &-tab {
    &-active {
      color: var(--blue-color);
      border-bottom: 2px solid var(--blue-color);
    }
  }

  &-content {
    height: 100%;
  }

  ::-webkit-scrollbar-track {
    background-color: var(--bg-card-color);
  }
}
</style>
