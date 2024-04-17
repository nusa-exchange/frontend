import DepthChartPanel from './chart_panel/depth_chart';
import GirdChartPanel from './chart_panel/gird_chart';
import MarkChartPanel from './chart_panel/mark_chart';
import XAxisChartPanel from "./chart_panel/x_axis_chart";
import YAxisChartPanel from "./chart_panel/y_axis_chart";
import { default_config } from './config';
import utlis from "./utlis";

export interface DepthData {
  price: number;
  total: number;
  volume: number;
};

export class Chart {
  gird_chart_panel: GirdChartPanel;
  depth_chart_panel: DepthChartPanel;
  mark_chart_panel: MarkChartPanel;
  x_axis_chart_panel: XAxisChartPanel;
  y_axis_chart_panel: YAxisChartPanel;

  element_id: string;
  config = default_config;
  price_precision = 2;
  gird_count = 4;
  depth_data: { buy: DepthData[]; sell: DepthData[] } = {
    buy: [],
    sell: [],
  };

  valueMap = new Map<number[], DepthData>();

  get element() {
    return document.getElementById(this.element_id);
  }

  get depth_chart_panel_height() {
    return this.element.clientHeight - this.config.xAxis.height;
  }

  get depth_chart_panel_width() {
    const parent_width = this.element.clientWidth;

    return this.config.yAxis.tickText.position === "outside" ? parent_width - this.config.yAxis.width : parent_width;
  }

  get mark_chart_panel_height() {
    return this.depth_chart_panel_height;
  }

  get mark_chart_panel_width() {
    return this.depth_chart_panel_width;
  }

  get gird_chart_panel_height() {
    return this.depth_chart_panel_height;
  }

  get gird_chart_panel_width() {
    return this.depth_chart_panel_width;
  }

  get max_amount() {
    const depth_data = this.depth_data;

    if (depth_data.sell.length && depth_data.buy.length) {
      return Math.max(
        depth_data.sell[depth_data.sell.length - 1].total,
        depth_data.buy[depth_data.buy.length - 1].total
      );
    } else if (depth_data.sell.length) {
      return depth_data.sell[depth_data.sell.length - 1].total;
    } else if (depth_data.buy.length) {
      return depth_data.buy[depth_data.buy.length - 1].total;
    } else {
      return null;
    }
  }

  get chart_ready() {
    return this.gird_chart_panel.chart_ready && this.depth_chart_panel.chart_ready && this.mark_chart_panel.chart_ready && this.x_axis_chart_panel.chart_ready && this.y_axis_chart_panel.chart_ready;
  }

  constructor(element_id: string) {
    this.element_id = element_id;
  }

  set_config(config) {
    (this as any).config = utlis.merge(config, this.config);
  }

  init() {
    this.gird_chart_panel = new GirdChartPanel(this, this.depth_chart_panel_height, this.depth_chart_panel_width);
    this.depth_chart_panel = new DepthChartPanel(this, this.depth_chart_panel_height, this.depth_chart_panel_width);
    this.mark_chart_panel = new MarkChartPanel(this, this.element.clientHeight, this.depth_chart_panel_width);
    this.x_axis_chart_panel = new XAxisChartPanel(this, this.element.clientWidth);
    this.y_axis_chart_panel = new YAxisChartPanel(this, this.element.clientHeight);
  }

  draw() {
    this.depth_chart_panel.draw_chart();
    this.x_axis_chart_panel.draw_chart();
    this.y_axis_chart_panel.draw_chart();
  }

  resize() {
    this.gird_chart_panel.resize(this.depth_chart_panel_height, this.depth_chart_panel_width);
    this.depth_chart_panel.resize(this.depth_chart_panel_height, this.depth_chart_panel_width);
    this.mark_chart_panel.resize(this.element.clientHeight, this.depth_chart_panel_width);
    this.x_axis_chart_panel.resize(this.element.clientWidth);
    this.y_axis_chart_panel.resize(this.element.clientHeight);
  }

  destroy() {
    this.gird_chart_panel.destroy();
    this.depth_chart_panel.destroy();
    this.mark_chart_panel.destroy();
    this.x_axis_chart_panel.destroy();
    this.y_axis_chart_panel.destroy();
  }
}
