import utlis from '../utlis';
import ChartPanel from "./base";

export default class GirdChartPanel extends ChartPanel {
  height!: number;
  width!: number;

  get context() {
    return utlis.getContext2D(this.canvas);
  }

  constructor(parent: ChartPanel["$parent"], height: number, width: number) {
    super();

    this.$parent = parent;
    this.height = height;
    this.width = width;

    this.canvas = utlis.createCanvas(this.height, this.width, this.parent_element);
    this.canvas.style.position = "absolute";
    this.canvas.style.left = "0";

    this.draw_chart();
    this.chart_ready = true;
  }

  resize(height: number, width: number) {
    this.height = height;
    this.width = width;

    utlis.resizeCanvas(this.canvas, height, width);

    this.draw_chart();
  }

  draw_chart() {
    const context = this.context;
    const height = this.height;
    const width = this.width;
    const gird_count = this.gird_count;

    context.clearRect(0, 0, width, height);

    this.draw_gird_horizontal(context, height, width, gird_count);
    this.draw_gird_vertical(context, height, width, gird_count);
    this.has_paint = true;
  }

  draw_gird_horizontal(context: CanvasRenderingContext2D, height: number, width: number, gird_count: number) {
    context.beginPath();
    context.lineWidth = this.config.gird.horizontal.size;
    context.strokeStyle = this.config.gird.horizontal.color;

    for (let count = 1; count < gird_count; count++) {
      context.beginPath();
      context.setLineDash(this.config.gird.horizontal.style === "dash" ? this.config.gird.horizontal.dashValue : []);
      context.moveTo(
        0,
        (height / gird_count) * count
      );
      context.lineTo(
        width,
        (height / gird_count) * count
      );
      context.stroke();
      context.closePath();
    }
  }

  draw_gird_vertical(context: CanvasRenderingContext2D, height: number, width: number, gird_count: number) {
    context.beginPath();
    context.lineWidth = this.config.gird.vertical.size;
    context.strokeStyle = this.config.gird.vertical.color;

    for (let count = 1; count < gird_count; count++) {
      context.beginPath();
      context.setLineDash(this.config.gird.vertical.style === "dash" ? this.config.gird.vertical.dashValue : []);
      context.moveTo(
        (width / gird_count) * count,
        0
      );
      context.lineTo(
        (width / gird_count) * count,
        height
      );
      context.stroke();
      context.closePath();
    }
  }
}