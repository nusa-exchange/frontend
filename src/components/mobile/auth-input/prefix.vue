<template>
  <div class="z-auth-input-prefix" @click="$emit('click')">
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class AuthInputPrefix extends Vue {}
</script>
