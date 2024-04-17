<template>
  <div class="svg-box" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import colors from "@/colors";
import sparkline from "@/library/sparkline";
import ApiClient from "@/library/z-apiclient";

@Component
export default class Sparkline extends Vue {
  @Prop() readonly market_id!: string;

  data: Array<number> = [];

  async mounted() {
    this.data = await this.get_sparkline();
    this.$nextTick(() => {
      sparkline(this.$el, {
        values: this.data,
        width: (this.$el as HTMLElement).clientWidth.toString(),
        height: (this.$el as HTMLElement).clientHeight.toString(),
        lineWidth: 1,
        spotColor: "transparent",
        highlightSpotColor: "transparent",
        highlightLineColor: "transparent",
        minSpotColor: "transparent",
        maxSpotColor: "transparent",
        lineColor: colors["blue-dark-color"],
        fillColor: colors["bg-card-head-color"],
        borderColor: "transparent"
      });
    });
  }

  async get_sparkline() {
    const time_now = new Date();
    const time_to = new Date();
    const time_from = new Date(time_now.setDate(time_now.getDate() - 1));

    try {
      const { data }: { data: number[] } = await new ApiClient("trade").get(
        `public/markets/${this.market_id}/k-line`,
        {
          time_from: (time_from.getTime() / 1000).toFixedNumber(0),
          time_to: (time_to.getTime() / 1000).toFixedNumber(0),
          limit: 1000
        }
      );

      return data.map(row => row[4]);
    } catch (error) {
      return error;
    }
  }
}
</script>
