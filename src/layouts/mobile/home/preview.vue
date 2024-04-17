<template>
  <div class="preview">
    <swiper :options="swiperOption">
      <swiper-slide v-for="(banner, i) in banners" :key="i">
        <a class="preview-image-content" :href="banner.url" target="_blank">
          <img :src="banner.image" />
        </a>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script lang="ts">
import { PublicController } from "@/controllers";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Preview extends Vue {
  swiperOption = {
    loop: true,
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    spaceBetween: 0,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: false
    },
    autoplay: {
      delay: 15000,
      disableOnInteraction: false
    }
  };

  get banners() {
    return PublicController.banners;
  }
}
</script>

<style lang="less">
.preview {
  background-color: var(--bg-card-color);

  .swiper-slide {
    width: 384px * 0.8;
  }

  &-image-content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    img {
      max-width: 100%;
      max-height: 100%;
      border-radius: 8px;
      object-fit: contain;
    }
  }
}
</style>
