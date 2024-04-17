import { DepthData } from "../Chart";
import utlis from "../utlis";
import AxisChartPanel from "./axis_chart";

export default class XAxisChartPanel extends AxisChartPanel {
  width: number;

  get height() {
    return this.config.xAxis.height;
  }

  constructor(parent: AxisChartPanel["$parent"], width: number) {
    super();

    this.$parent = parent;
    this.width = width;

    this.canvas = utlis.createCanvas(
      this.height,
      this.width,
      this.parent_element
    );
    this.canvas.style.position = "absolute";
    this.canvas.style.bottom = "0";

    this.draw_chart();
    this.chart_ready = true;
  }

  resize(width: number) {
    this.width = width;

    utlis.resizeCanvas(this.canvas, this.height, width);

    this.draw_chart();
  }

  draw_chart() {
    const context = this.context;
    const width =
      this.config.yAxis.tickText.position === "outside"
        ? this.width - this.config.yAxis.width
        : this.width;

    if (this.has_paint)
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.draw_line(context, width);
    this.draw_ticks(context, width, this.gird_count);
    this.has_paint = true;
  }

  draw_line(context: CanvasRenderingContext2D, width: number) {
    context.strokeStyle = this.config.xAxis.axisLine.color;
    context.moveTo(0, 0);
    context.lineTo(width, 0);
    context.stroke();
    context.closePath();
  }

  draw_ticks(
    context: CanvasRenderingContext2D,
    width: number,
    gird_count: number
  ) {
    context.font = `${this.config.xAxis.tickText.size}px Arial`;

    const depth_data = this.depth_data;

    ["buy", "sell"].forEach((type: ZTypes.OrderSide) => {
      if (!depth_data[type].length) return;

      this.draw_tick(context, width, depth_data[type], gird_count, type);
    });
  }

  draw_tick(
    context: CanvasRenderingContext2D,
    width: number,
    data: DepthData[],
    gird_count: number,
    type: string
  ) {
    const equalWidth = width / 2;
    const length = data.length;
    const gap = this.config.chart.gap;
    const y = this.config.xAxis.tickText.margin;
    const scaleW = equalWidth / (length ? length : 1);
    const Divisor = Math.ceil(length / gird_count * 2);
    let x = 0;

    context.textAlign = "center";

    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      if (i % Divisor && i !== data.length - 1) {
        continue;
      }

      const text = item.price.toFixed(this.price_precision);
      const textWidth = Math.floor(context.measureText(text).width);

      if (type === "sell") {
        x = equalWidth + i * scaleW;
      } else {
        x = equalWidth - i * scaleW;
      }

      if (x + textWidth >= width) {
        x = width - textWidth / 2 - 5;
      } else if (x < textWidth) {
        x = textWidth / 2 + 5;
      } else if (type === "buy" && i === 0) {
        x = equalWidth - gap - textWidth / 2;
      } else if (type === "sell" && i === 0) {
        x = equalWidth + gap + textWidth / 2;
      }

      const tickConfig = {
        x: x,
        y: 1,
        height: 0,
        size: this.config.xAxis.tickLine.size,
        tickColor: this.config.xAxis.tickLine.color,
        textColor: this.config.xAxis.tickText.color,
        font: `${this.config.xAxis.tickText.size}px Arial`,
      };
      this.render_tick(context, x, y, text, "horizontal", tickConfig);
    }
  }
}
