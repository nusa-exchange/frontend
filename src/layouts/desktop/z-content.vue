<template>
  <div class="ant-layout-content">
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class ZContent extends Vue {}
</script>
