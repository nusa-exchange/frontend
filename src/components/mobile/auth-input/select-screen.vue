<template>
  <panel-view class="z-auth-input-select-screen">
    <head-bar :title="title" @back="destroy" />

    <div class="z-auth-input-select-screen-content">
      <div
        v-for="(item, key) in list"
        :key="key"
        class="z-auth-input-select-screen-item"
        @click="onListItemClicked(key)"
      >
        {{ item.name }}
      </div>
    </div>
  </panel-view>
</template>

<script lang="ts">
import { ScreenMixin } from "@/mixins/mobile";
import { Component, Prop, Mixins } from "vue-property-decorator";

@Component
export default class ZAuthInputSelectScreen extends Mixins(ScreenMixin) {
  @Prop() readonly title!: string;
  @Prop() readonly list!: any[];

  onListItemClicked(key: string) {
    this.$emit("change", key);

    this.destroy();
  }
}
</script>
