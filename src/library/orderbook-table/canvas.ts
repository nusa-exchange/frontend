import utlis from "./utlis";

export default class Canvas {
  canvas: HTMLCanvasElement;

  height: number;
  width: number;

  chart_ready = false;
  parent_element: HTMLElement;

  constructor(parent_element: HTMLElement, height: number, width: number) {
    this.parent_element = parent_element;
    this.height = height;
    this.width = width;

    this.canvas = utlis.createCanvas(
      height,
      width,
      this.parent_element
    );

    this.chart_ready = true;
  }

  get context() {
    return utlis.getContext2D(this.canvas);
  }

  destroy() {
    this.chart_ready = false;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
