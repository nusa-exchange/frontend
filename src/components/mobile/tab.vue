<template>
  <div class="cube-tab" :class="{'cube-tab_active': isActive}" @click="handleClick" :disabled="disabled">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: [String, Number],
      required: true
    },
    value: {
      type: [String, Number],
      default() {
        return this.label;
      }
    },
    disabled: {
      type: Boolean,
      required: false
    }
  },
  mounted() {
    this.$parent.addTab(this);
  },
  destroyed() {
    this.$parent.removeTab(this);
  },
  computed: {
    isActive() {
      return this.$parent.value === this.value;
    }
  },
  methods: {
    handleClick(item) {
      if(this.disabled) return;
      this.$parent.trigger(this.value);
    }
  }
};
</script>