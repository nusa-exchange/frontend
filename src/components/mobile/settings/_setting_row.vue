<template>
  <div class="setting-row" @click="$emit('click')">
    <span class="text"><slot /></span>
    <span class="info">
      <div v-if="info" class="text">{{ info }}</div>
      <i
        v-if="type === ARROW && allowIcon"
        :class="['zicon-arrow-forward', iconClass]"
      />
      <a-icon
        v-else-if="type === SUCCESS && allowIcon"
        type="check"
        :class="iconClass"
      />
    </span>
  </div>
</template>

<script>
export default {
  props: {
    info: String,
    allowIcon: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: "arrow"
    },
    iconClass: [String, Object, Array]
  },
  data: () => ({
    ARROW: "arrow",
    SUCCESS: "success"
  })
};
</script>
