<template>
  <div class="choose-completer">
    <span class="text-selected" @click="changeDropdown">
      {{ selectedText || selected }}
      <i v-if="isShowing" class="zicon-caret-up" />
      <i v-else class="zicon-caret-down" />
    </span>
    <div
      v-show="isShowing"
      :style="heightContent"
      class="choose-completer-dropdown allow-input"
      @click="closeDropdown"
    >
      <div class="choose-modal" @click.stop="openDropdown">
        <div class="input-search">
          <i class="zicon-search" />
          <input v-model="input" type="text" placeholder="Search" />
        </div>
        <div class="choose-list">
          <div
            v-for="(item, index) in dataFilter"
            :key="index"
            :class="['choose-item', { selected: selected === item.value }]"
            @click.stop="changeSelected(item.value)"
          >
            {{ item.name }}
            <span v-if="item.info" class="info">({{ item.info }})</span>
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
    input: "",
    isShowing: false
  }),
  computed: {
    top() {
      if (!this.$el) return 0;
      return this.$el.offsetHeight + this.$el.offsetTop;
    },
    wrapHeight() {
      return document.body.offsetHeight;
    },
    heightContent() {
      const height = this.wrapHeight - this.top;

      return { height: height + "px" };
    },
    dataFilter() {
      let { input } = this;
      const data = Object.values(this.data);

      const value = data.filter(item => {
        const { value, info } = item;
        input = input.toUpperCase();
        const typeFirst = value.toUpperCase().includes(input);
        const typeTwo = info ? info.toUpperCase().includes(input) : false;
        return typeFirst || typeTwo;
      });

      return value;
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
