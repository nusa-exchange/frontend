<template>
  <div :class="['setting-group', { 'no-background': noBackground }]">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    "noBackground": Boolean
  }
};
</script>
