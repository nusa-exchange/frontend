<template>
  <div class="z-empty">
    <div class="z-empty-content">
      <img class="z-empty-logo" src="@/assets/img/empty.png" />
      <span>No Data</span>
    </div>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";

@Component
export default class ZEmpty extends Vue {}
</script>

<style lang="less">
@import "~@/assets/css/components/z-empty";
</style>
