<template>
  <div class="z-auto-complete" :class="[{ selected }, type]">
    <div v-if="selected" class="mask" @click="selected = !selected" />
    <div class="select-con" @click="selected = !selected">
      <div class="con">
        {{ value }}
      </div>
      <div class="more">
        <i class="zicon-caret-down" />
      </div>
    </div>
    <ul class="list">
      <li
        v-for="(data, index) in rows"
        :key="index"
        @click="changeSelect(data)"
        v-text="data"
      />
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class AutoComplete extends Vue {
  @Prop() readonly rows!: any[];
  @Prop() readonly value!: string;
  @Prop({ default: "small" }) readonly type!: "small" | "big";

  selected = false;

  changeSelect(data) {
    this.selected = !this.selected;
    this.$emit("input", data);
  }
}
</script>

<style lang="less">
.z-auto-complete {
  width: 240px;
  border: 1px solid #314362;
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  color: #e5e6e8;
  position: relative;
  cursor: pointer;
  .select-con {
    line-height: 50px;
    display: flex;
    height: 50px;
    .con {
      height: 100%;
      width: 90%;
      padding-left: 5%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .more {
      display: inline-block;
      flex-basis: 10%;
      width: 10%;
      background: var(--icon-color);
      height: 100%;
      text-align: center;
      color: #fff;
      vertical-align: middle;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      border: 1px solid var(--icon-color);
      i {
        vertical-align: middle;
        font-size: 10px;
      }
    }
  }
  .list {
    padding: 0 10px;
    background: #3f5a85;
    position: absolute;
    left: 0;
    top: 50px;
    width: 100%;
    max-height: 0px;
    transition: all 0.15s ease-out;
    overflow-y: auto;
    z-index: 1;
    li {
      width: 100%;
      height: 30px;
      line-height: 30px;
      color: #f6f7f8;
      border-bottom: 1px solid #7c89af;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &:hover {
        background: rgba(49, 58, 86, 0.2);
      }
    }
  }
  &.selected {
    border: 1px solid #b5cfff;
    .list {
      border: 1px solid var(--icon-color);
      transition: all 0.25s ease-in;
      max-height: 200px;
    }
  }
}
</style>
