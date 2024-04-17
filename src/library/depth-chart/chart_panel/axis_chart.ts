import ChartPanel from "./base";

export interface TickConfig {
  x: number;
  y: number;
  height: number;
  size: number;
  tickColor: string;
  textColor: string;
  font: string;
}

export default class AxisChartPanel extends ChartPanel {
  render_tick(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    text: string,
    type: "horizontal" | "vertical",
    config: TickConfig
  ) {
    context.beginPath();
    context.lineWidth = config.size;
    context.fillStyle = config.textColor;
    context.strokeStyle = config.tickColor;

    if (type === "vertical") {
      context.moveTo(config.x, config.y);
      context.lineTo(config.height + config.x, config.y);
    } else {
      context.moveTo(config.x, config.y);
      context.lineTo(config.x, config.y + config.height);
    }

    context.stroke();
    context.fillText(text, x, y);
    context.closePath();
  }
}
