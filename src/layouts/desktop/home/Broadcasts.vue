<template>
  <div class="page-home-broadcasts">
    <div class="page-home-broadcasts-swiper">
      <a-icon type="sound" />
      <swiper :options="swiperOption">
        <swiper-slide v-for="(broadcast, i) in broadcasts" :key="i">
          <a target="_blank" :href="broadcast.url">{{ broadcast.title }}</a>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class BroadCasts extends Vue {
  swiperOption = {
    direction: 'vertical',
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: false
    }
  }

  get broadcasts() {
    return this.PublicController.broadcasts;
  }
}
</script>

<style lang="less">
.page-home-broadcasts {
  position: absolute;
  bottom: 0;
  height: 40px;
  width: 100%;
  background: rgba(24, 39, 68, 0.4);

  &-swiper {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    height: 100%;
    line-height: 40px;
    font-size: 14px;

    i {
      line-height: inherit;
      font-size: 20px;
      margin-right: 12px;
    }

    .swiper-container {
      margin: 0;

      a {
        color: var(--color-gray);

        &:hover {
          color: var(--blue-color);
        }
      }
    }
  }
}
</style>
