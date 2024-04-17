import utlis from "../utlis";
import AxisChartPanel from "./axis_chart";

export default class YAxisChartPanel extends AxisChartPanel {
  height: number;

  get width() {
    return this.config.yAxis.width;
  }

  constructor(
    parent: AxisChartPanel["$parent"],
    height: number
  ) {
    super();

    this.$parent = parent;
    this.height = height;

    this.canvas = utlis.createCanvas(this.height, this.width, this.parent_element);
    this.canvas.style.position = "absolute";
    this.canvas.style[this.config.yAxis.tickText.position === "outside" ? "right" : "left"] = "0";

    this.chart_ready = true;
  }

  resize(height: number) {
    this.height = height;

    utlis.resizeCanvas(this.canvas, height, this.width);

    this.draw_chart();
  }

  draw_chart() {
    const context = this.context;
    const height = this.height - this.config.xAxis.height;

    if (this.has_paint) context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.font = `${this.config.yAxis.tickText.size}px Arial`;

    this.draw_line(context, height);
    if (this.max_amount) this.draw_ticks(context, height);
    this.has_paint = true;
  }

  draw_line(context: CanvasRenderingContext2D, height: number) {
    context.beginPath();
    context.strokeStyle = this.config.yAxis.axisLine.color;
    context.moveTo(0, 0);
    context.lineTo(0, height + 1);
    context.stroke();
    context.closePath();
  }

  draw_ticks(context: CanvasRenderingContext2D, height: number) {
    const gird_count = this.gird_count;

    for (let i = 0; i <= gird_count; i++) {
      const x = this.config.yAxis.tickText.margin;
      const y = height - (height / gird_count) * i;

      if (y <= this.config.yAxis.tickText.size) {
        context.textBaseline = "top";
      } else {
        context.textBaseline = this.config.yAxis.tickText.baseLine;
      }

      const tickConfig = {
        x: 0,
        y: y,
        height: this.config.yAxis.tickLine.width,
        size: this.config.yAxis.tickLine.size,
        tickColor: this.config.yAxis.tickLine.color,
        textColor: this.config.yAxis.tickText.color,
        font: `${this.config.yAxis.tickText.size}px Arial`,
      };

      this.render_tick(
        context,
        x,
        y,
        utlis.toPretty(((this.max_amount / gird_count) * i) * (1 + (this.config.chart.paddingTop / height))),
        "vertical",
        tickConfig
      );
    }
  }
}
