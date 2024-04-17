<template>
  <div class="head-bar">
    <div class="head">
      <div class="title">
        Markets
      </div>
      <a-icon type="search" @click="$emit('click')" />
    </div>
    <cube-tab-bar
      ref="tab-nav"
      v-model="selectedLabel"
      show-slider
      class="action-menu"
      :use-transition="false"
      :data="list_bid"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import config from "@/config";

@Component
export default class MarketsHeadBar extends Vue {
  selectedLabel = this.list_bid[1].label;

  get list_bid() {
    return ["Favorites", ...config.list_bid].map(bid => ({
      label: bid
    }));
  }
}
</script>
