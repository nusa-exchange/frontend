<template>
  <div class="choose-picker">
    <span class="text-selected" @click="changeDropdown">
      {{ selectedText || selected }}
      <i v-if="isShowing" class="zicon-caret-up" />
      <i v-else class="zicon-caret-down" />
    </span>
    <div
      v-show="isShowing"
      ref="content"
      :style="heightContent"
      class="choose-picker-dropdown"
      @click="closeDropdown"
    >
      <div class="choose-modal" @click.stop="openDropdown">
        <div class="choose-list">
          <div
            v-for="(item, index) in data"
            :key="index"
            :class="['choose-item', { selected: selected === item.value }]"
            @click.stop="changeSelected(item.value)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ZSmartModel from "@/library/z-eventbus";

export default {
  props: {
    selected: String,
    selectedText: String,
    data: Object //key { name: "ETH/USDT", value: "key" }
  },
  data: () => ({
    isShowing: false
  }),
  computed: {
    top() {
      if (!this.$refs.content) return 0;
      return this.$refs.content.offsetTop;
    },
    wrapHeight() {
      return document.body.offsetHeight;
    },
    heightContent() {
      const height = this.wrapHeight - this.top;

      return { height: height + "px" };
    }
  },
  mounted() {
    ZSmartModel.on("on-open", this.closeDropdown);
  },
  methods: {
    onOpeningDropdown() {
      ZSmartModel.emit("on-open", null);
    },
    changeSelected(value) {
      this.$emit("on-change", value);
      this.closeDropdown();
    },
    openDropdown() {
      if (!this.isShowing) {
        this.onOpeningDropdown();
        this.isShowing = true;
      }
    },
    changeDropdown() {
      if (!this.isShowing) {
        this.onOpeningDropdown();
      }

      this.$nextTick(() => {
        this.isShowing = !this.isShowing;
      });
    },
    closeDropdown() {
      if (this.isShowing) this.isShowing = false;
    }
  }
};
</script>
