<template>
  <z-content class="page-home">
    <Preview />
    <FeatureMarkets class="container" />
    <MarketList class="container" />
    <Advantages class="container" />
  </z-content>
</template>

<script lang="ts">
import Preview from "@/layouts/desktop/home/Preview.vue";
import MarketList from "@/layouts/desktop/home/market-list";
import FeatureMarkets from "@/layouts/desktop/home/FeatureMarkets.vue";
import Advantages from "@/layouts/desktop/home/Advantages.vue";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    Preview,
    MarketList,
    FeatureMarkets,
    Advantages,
  },
})
export default class Home extends Vue {
  page = 1;

  created() {
    if (localStorage.getItem("favorites") === null)
      localStorage.setItem("favorites", "");
  }
}
</script>
