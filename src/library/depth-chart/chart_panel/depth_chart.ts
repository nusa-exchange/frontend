import utlis from "../utlis";
import ChartPanel from './base';

export interface DepthData {
  price: number;
  total: number;
  volume: number;
}

export default class DepthChartPanel extends ChartPanel {
  height: number;
  width: number;

  constructor(parent: ChartPanel["$parent"], height: number, width: number) {
    super();

    this.$parent = parent;
    this.height = height;
    this.width = width;
    
    this.canvas = utlis.createCanvas(
      this.height,
      this.width,
      this.parent_element
    );
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
    const depth_data = this.depth_data;

    context.beginPath();

    if (this.has_paint) {
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      context.fillStyle = "transparent";
      context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    const tempList = [];

    ["buy", "sell"].forEach(side => {
      if (!depth_data[side].length) return;

      this.draw_chart_by_side(context, height, width, depth_data[side], side, (value) => {
        tempList.push(value);
      });
    });
    this.has_paint = true;

    this.valueMap.clear();

    tempList.sort((a, b) => a.x - b.x).forEach((item) =>
      this.valueMap.set([item.x, item.y, item.side], item.value)
    );

    if (this.$parent.mark_chart_panel) {
      if (this.$parent.mark_chart_panel.mouseEvent.hover) {
        this.$parent.mark_chart_panel.draw_tooltip(this.$parent.mark_chart_panel.mouseEvent.offsetX);
      }
    }
  }

  draw_chart_by_side(context: CanvasRenderingContext2D, height: number, width: number, data: DepthData[], side: string, callback: (...args: any[]) => void) {
    const { gap, paddingTop } = this.config.chart;
    const equalWidth = width / 2;
    const scaleW = equalWidth / data.length;

    context.beginPath();
    context.fillStyle = this.config.chart[`${side}FillColor`];
    if (side === "sell") context.moveTo(equalWidth + gap, height);

    let x = 0;
    let y = 0;

    data.forEach((item, i) => {
      if (side === "buy") {
        x = equalWidth - Number(i) * scaleW - gap;
      } else {
        x = equalWidth + Number(i) * scaleW + gap;
      }
      y = height - (item.total / this.max_amount) * (height - paddingTop);

      if (side === "buy" && Number(i) === 0 && x > 0) {
        context.lineTo(x, height);
      }

      if (side === "buy" && x <= 2) {
        x = 2;
      } else if (x > width - 2) {
        x = width - 2;
      }

      context.lineTo(x, y);

      callback({
        x,
        y,
        value: item,
        side,
      });
    });

    context.lineWidth = this.config.chart.strokeSize;
    context.strokeStyle = this.config.chart[`${side}StrokeColor`];
    context.lineTo(side === "buy" ? -1 : width + 1, y);
    context.lineTo(side === "buy" ? -1 : width + 1, height);
    //context.lineTo(side === "buy" ? equalWidth - gap : equalWidth + gap, height);
    context.stroke();
    context.fill();
    context.closePath();
  }
}
