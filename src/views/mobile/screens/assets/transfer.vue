<template>
  <panel-view v-if="isShowing" class="screen-assets-transfer"> </panel-view>
</template>

<script lang="ts">
import { ScreenMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";

@Component
export default class TransferScreen extends Mixins(ScreenMixin) {}
</script>
