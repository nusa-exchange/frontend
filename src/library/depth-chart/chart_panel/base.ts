import { Chart } from "../Chart";
import utlis from "../utlis";

export default class ChartPanel {
  canvas: HTMLCanvasElement;

  $parent: Chart;

  chart_ready = false;
  has_paint = false;

  get parent_element() {
    return this.$parent.element;
  }

  get config() {
    return this.$parent.config;
  }

  get gird_count() {
    return this.$parent.gird_count;
  }

  get price_precision() {
    return this.$parent.price_precision;
  }

  get depth_data() {
    return this.$parent.depth_data;
  }

  get max_amount() {
    return this.$parent.max_amount;
  }

  get valueMap() {
    return this.$parent.valueMap;
  }

  get context() {
    return utlis.getContext2D(this.canvas);
  }

  destroy() {
    this.chart_ready = false;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
