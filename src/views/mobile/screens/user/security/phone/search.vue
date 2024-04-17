<template>
  <search-screen
    class="search-country-code"
    v-model="value"
    :data="findCountry(value)"
    @click="on_search_click"
  >
    <template slot-scope="{ item }">
      <span class="text-left">{{ item.name }}</span>
      <span class="text-right">{{ item.dial_code }}</span>
    </template>
  </search-screen>
</template>

<script lang="ts">
import * as helpers from "@/library/z-helpers";
import { SearchScreenMixin } from "@/mixins/mobile";
import { Component, Mixins } from "vue-property-decorator";

@Component({
  components: {
    "search-screen": () => import("@/views/mobile/screens/search")
  }
})
export default class SearchMarketScreen extends Mixins(SearchScreenMixin) {
  value = "";

  findCountry(search) {
    const countries = helpers.getAllRegion();

    return countries.filter(country => {
      for (const key in country) {
        if (
          country[key]
            .toString()
            .toLowerCase()
            .includes(search)
        )
          return true;
      }
    });
  }

  on_search_click(_key, country) {
    this.$emit("click", country.dial_code);

    this.destroy();
  }
}
</script>

<style lang="less">
.search-country-code {
}
</style>
