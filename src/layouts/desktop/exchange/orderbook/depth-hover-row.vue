<template>
  <div
    class="z-table-row depth-row"
    @click="$emit('click')"
    @mouseover="$emit('mouseover')"
    @mouseleave="$emit('mouseleave')"
  ></div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class FakeRow extends Vue {}
</script>
