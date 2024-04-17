<template>
  <swiper :options="swiperOption" class="feature-markets">
    <swiper-slide>
      <feature-market
        v-for="(market_id, index) in featureMarkets('one')"
        :key="`one` + index"
        :market_id="market_id"
        @click="onClick"
      />
    </swiper-slide>
    <swiper-slide>
      <feature-market
        v-for="(market_id, index) in featureMarkets('two')"
        :key="`one` + index"
        :market_id="market_id"
        @click="onClick"
      />
      <div
        class="feature-markets-item more"
        @click="$router.push('/m/markets')"
      >
        More <a-icon type="double-right" />
      </div>
    </swiper-slide>
    <div slot="pagination" class="swiper-pagination" />
  </swiper>
</template>

<script lang="ts">
import FeatureMarket from "./feature-market.vue"
import { Vue, Component } from "vue-property-decorator";
import config from "@/config";

@Component({
  components: {
    FeatureMarket
  }
})
export default class FeatureMarkets extends Vue {
  swiperOption = {
    spaceBetween: 0,
    pagination: {
      el: ".swiper-pagination",
      clickable: false
    }
  };

  onClick(market: ZTypes.Market) {
    this.$emit("click", market);
  }

  featureMarkets(type) {
    const valueOne: string[] = [];
    const valueTwo: string[] = [];
    const { feature_markets } = config;
    for (const i in feature_markets) {
      if (Number(i) <= 2) valueOne.push(feature_markets[i]);
      else valueTwo.push(feature_markets[i]);
    }

    return type === "one" ? valueOne : valueTwo;
  }
}
</script>
