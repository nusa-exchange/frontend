<template>
  <div class="z-tab-bar">
    <router-link
      v-for="(data, index) in TAB"
      :key="index"
      :to="data.url"
      :class="[
        'z-tab-bar-item',
        { 'z-tab-bar-item-selected': path === data.url }
      ]"
    >
      <div class="z-tab-bar-item-content">
        <div class="icon"><a-icon :type="data.icon" /></div>
        <span class="text">{{ data.text }}</span>
      </div>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class ZTabBar extends Vue {
  TAB = [
    {
      text: "Home",
      icon: "home",
      url: "/m"
    },
    {
      text: "Markets",
      icon: "line-chart",
      url: "/m/markets"
    },
    {
      text: "Trades",
      icon: "retweet",
      url: "/m/exchange"
    },
    {
      text: "Assets",
      icon: "wallet",
      url: "/m/assets"
    }
  ];

  get path() {
    return this.$route.path;
  }
}
</script>

<style lang="less">
.z-tab-bar {
  display: flex;
  position: fixed;
  bottom: 0;
  height: 50px;
  width: 100vw;
  background-color: var(--bg-card-color);

  &-item {
    position: relative;
    height: 100%;
    margin: auto;
    flex: 1;
    text-align: center;

    &:not(&-selected) {
      color: var(--color-gray);
    }

    &-content {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);

      i {
        font-size: 18px;
      }
    }
  }
}
</style>
