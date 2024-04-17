import utlis from "../utlis";
import ChartPanel from "./base";

export default class MarkChartPanel extends ChartPanel {
  height: number;
  width: number;

  mouseEvent = {
    hover: false,
    offsetX: 0,
  };

  get context() {
    return utlis.getContext2D(this.canvas);
  }

  constructor(parent: ChartPanel["$parent"], height: number, width: number) {
    super();

    this.$parent = parent;
    this.height = height - this.config.xAxis.height;
    this.width = width;

    this.canvas = utlis.createCanvas(
      height,
      width,
      this.parent_element
    );
    this.canvas.style.position = "absolute";
    this.canvas.style.left = "0";
    this.canvas.style.zIndex = "1";

    this.start_event();
    this.chart_ready = true;
  }

  resize(height: number, width: number) {
    this.height = height - this.config.xAxis.height;
    this.width = width;

    utlis.resizeCanvas(this.canvas, height, width);
  }

  start_event() {
    this.canvas.addEventListener(
      "touchstart",
      (event) => {
        this.handleTouchMove(event);
      },
      false
    );
    this.canvas.addEventListener(
      "touchend",
      (event) => {
        this.handleTouchOut();
      },
      false
    );
    this.canvas.addEventListener(
      "touchcancel",
      (event) => {
        this.handleTouchOut();
      },
      false
    );
    this.canvas.addEventListener(
      "touchmove",
      (event) => {
        this.handleTouchMove(event);
      },
      false
    );

    this.canvas.addEventListener(
      "mousemove",
      (event) => {
        this.handleMouseMove(event);
      }
    )

    this.canvas.addEventListener(
      "mouseout",
      () => {
        this.handleMouseOut();
      }
    )
  }

  handleMouseMove(event?: MouseEvent) {
    const offsetX = event.offsetX;

    this.draw_tooltip(offsetX);
  }

  handleTouchMove(event?: TouchEvent) {
    if (!event) return;
    if (!event.touches) return;
    if (!event.touches.length) return;

    const offsetX = event.touches[0].clientX;

    this.draw_tooltip(offsetX);
  }

  draw_tooltip(offsetX: number) {
    const valueMap = this.valueMap;
    const context = this.context;
    const width = this.width;
    const height = this.height;

    if (offsetX) {
      this.mouseEvent.hover = true;
      this.mouseEvent.offsetX = offsetX;
    }
    if (offsetX === undefined && this.mouseEvent.hover) {
      offsetX = this.mouseEvent.offsetX;
    }

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const key of valueMap.keys()) {
      const x = key[0];
      const y = key[1];
      const side = key[2];
      const result = valueMap.get(key);
      const colorsDepth = this.config.tooltip.crosshair.color === "side" ? this.config.chart[`${side}StrokeColor`] : this.config.tooltip.crosshair.color;
      const colorsDepthArc = this.config.chart[`${side}FillColor`];

      if (offsetX < x) {
        context.strokeStyle = colorsDepth;
        context.lineWidth = 1;
        context.setLineDash(this.config.tooltip.crosshair.type === "dash" ? this.config.tooltip.crosshair.dashValue : []);
        context.clearRect(0, 0, width, height);

        //
        if (this.config.tooltip.type === "standard") {
          context.beginPath();
          context.moveTo(0, y);
          context.lineTo(width, y);
          context.stroke();
          context.closePath();

          context.beginPath();
          context.moveTo(x, 0);
          context.lineTo(x, height);
          context.stroke();
          context.closePath();

          const { paddingLeft, paddingRight, paddingTop, paddingBottom } = this.config.tooltip.standard;
          const fontSize = this.config.tooltip.standard.size;

          context.font = `${fontSize}px Arial`;

          let text = Number(result.total).toFixed(2);
          let textWidth = Math.floor(context.measureText(text).width);

          context.beginPath();
          context.fillStyle = this.config.tooltip.standard.bgColor;
          context.rect(
            0,
            y - (fontSize / 2) - paddingTop - paddingBottom / 2,
            textWidth + paddingLeft + paddingRight,
            fontSize + paddingTop + paddingBottom
          );
          context.fill();
          context.closePath();

          context.beginPath();
          context.fillStyle = this.config.tooltip.standard.color;
          context.fillText(text, paddingLeft, y + fontSize / 3.5);
          context.closePath();

          //////////

          text = Number(result.price).toFixed(this.price_precision);
          textWidth = Math.floor(context.measureText(text).width);
          const marginTop = (this.config.xAxis.height + fontSize) / 2;

          context.beginPath();
          context.fillStyle = this.config.tooltip.standard.bgColor;
          context.rect(
            x - (textWidth / 2) - paddingLeft,
            height + (marginTop / 2) - paddingTop,
            textWidth + paddingLeft + paddingRight,
            fontSize + paddingTop + paddingBottom
          );
          context.fill();
          context.closePath();

          context.beginPath();
          context.fillStyle = this.config.tooltip.standard.color;
          context.fillText(text, x - textWidth / 2, height + marginTop);
          context.closePath();
        } else {
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(x, height);
          context.stroke();
          context.closePath();

          context.beginPath();

          context.fillStyle = colorsDepthArc;
          context.arc(x, y, 10, 0, 2 * Math.PI);
          context.fill();
          context.closePath();

          context.beginPath();
          context.fillStyle = colorsDepth;
          context.arc(x, y, 5, 0, 2 * Math.PI);
          context.fill();
          context.closePath();

          context.beginPath();
          context.fillStyle = "rgba(12, 15, 29, 0.75)";
          context.font = "12px bold";

          const widthOffset = 165;
          const heightOffset = 100;
          const left = x - widthOffset / 2;
          let top = y - heightOffset - 12;

          if (top <= 0) {
            top = y + 10;
          }

          const isLeft = x + widthOffset < width;
          const marginLeft = 10;
          const marginTop = 24;
          const lineHeight = 20;
          const leftPos = left + widthOffset / 2;
          const leftPosAndMargin = left + marginLeft + widthOffset / 2 + 6;
          const rightPos = left - widthOffset / 2;
          const rightPosAndMargin = left - marginLeft + widthOffset - 206;
          const textPos = isLeft ? leftPosAndMargin : rightPosAndMargin;

          this.drawRoundedRect(
            context,
            isLeft ? leftPos : rightPos,
            top,
            heightOffset,
            widthOffset,
            4,
            true,
            false
          );

          context.fillStyle = colorsDepth;
          context.fillRect(leftPos, top, 5, heightOffset);
          context.font = `${this.config.tooltip.rect.title.size}px Arial`;
          context.textAlign = "left";

          context.fillStyle = this.config.tooltip.rect.title.color;
          context.fillText("Price", textPos, top + marginTop);
          context.fillStyle = this.config.tooltip.rect.value.color;
          context.font = `${this.config.tooltip.rect.value.size}px Arial`;
          context.fillText(
            utlis.toThousand(result.price),
            textPos,
            top + marginTop + 16
          );
          context.fillStyle = this.config.tooltip.rect.title.color;
          context.font = `${this.config.tooltip.rect.title.size}px Arial`;
          context.fillText("Sum", textPos, top + marginTop + lineHeight + 24);
          context.fillStyle = this.config.tooltip.rect.value.color;
          context.font = `${this.config.tooltip.rect.value.size}px Arial`;
          context.fillText(
            utlis.toThousand(result.total),
            textPos,
            top + marginTop + lineHeight + 40
          );
          context.closePath();
        }
        break;
      }
    }
  }

  handleMouseOut() {
    this.destroy_tooltip();
  }

  handleTouchOut() {
    this.destroy_tooltip();
  }

  destroy_tooltip() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.mouseEvent.hover = false;
    this.mouseEvent.offsetX = 0;
  }

  drawRoundedRect(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    height: number,
    width: number,
    r: number,
    fill: boolean,
    stroke: boolean
  ) {
    context.save();
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + r, r);
    context.arcTo(x + width, y + height, x + width - r, y + height, r);
    context.arcTo(x, y + height, x, y + height - r, r);
    context.arcTo(x, y, x + r, y, r);

    if (fill) {
      context.fill();
    }

    if (stroke) {
      context.stroke();
    }

    context.restore();
  }
}
