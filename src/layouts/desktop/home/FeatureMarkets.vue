<template>
  <ul class="feature-markets">
    <FeatureMarket
      v-for="(market_id, index) in feature_markets"
      :key="index"
      @click="MarketJoin(market_id)"
      :market_id="market_id"
    >
    </FeatureMarket>
  </ul>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import config from "@/config";
import FeatureMarket from "@/components/desktop/home/FeatureMarket.vue";

@Component({
  components: {
    FeatureMarket
  }
})
export default class FeatureMarkets extends Vue {
  get feature_markets() {
    return config.feature_markets
  }
};
</script>
