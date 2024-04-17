/** @format */

export interface StyleFace {
  lineWidth: number;
  lineColor: string;
  fillColor: string;
}

export interface OptionsFace extends StyleFace {
  width?: string;
  height?: string;
  type?: string;
  values?: number[];
  padding?: number;
  disableInteraction?: boolean;
  defaultPixelsPerValue?: number;
  spotRadius?: number;
  spotColor?: string;
  highlightSpotColor?: string;
  highlightLineColor?: string;
  minSpotColor?: string;
  maxSpotColor?: string;
  barColor?: string;
  negBarColor?: string;
  barWidth?: number;
  barSpacing?: number;
  zeroColor?: string;
  zeroAxis?: boolean;
  offset?: number;
  sliceColors?: string[];
  borderWidth?: number;
  borderColor?: string;
}

export const styleDefault: StyleFace = {
  lineColor: '#096dd9',
  fillColor: '#bae7ff',
  lineWidth: 1,
};

// 公共的参数
export const optionsDefault: OptionsFace = {
  width: 'auto',
  height: 'auto',
  type: 'line',
  values: [],
  disableInteraction: false,
  padding: 0, // 间距
  // line params start
  defaultPixelsPerValue: 3,
  spotRadius: 1, // 线的点的半径
  spotColor: '#f5222d',
  highlightSpotColor: '#5f5',
  highlightLineColor: '#f22',
  minSpotColor: '#f5222d',
  maxSpotColor: '#f5222d',
  // line params end
  // bar params start
  barColor: '#f5222d',
  negBarColor: '#52c41a',
  barWidth: 4,
  barSpacing: 1,
  zeroColor: '#bfbfbf',
  zeroAxis: true,
  // bar params end
  // pie params start
  offset: 0,
  sliceColors: [
    '#fa8c16', // 日暮
    '#a0d911', // 青柠
    '#eb2f96', // 法式洋红
    '#1890ff', // 佛晓蓝
    '#f5222d', // 薄暮
    '#faad14', // 金盏花
    '#52c41a', // 极光绿
    '#2f54eb', // 极客蓝
    '#fa541c', // 火山
    '#fadb14', // 日出
    '#13c2c2', // 明青
    '#722ed1', // 酱紫
  ],
  borderWidth: 0,
  borderColor: '#000',
  // pie params end
  ...styleDefault,
};

export interface CoreReturnFace {
  canvas: any;
  render: (...args: any) => void;
}

// 点
export enum PointEnum {
  START_POINT,
  END_POINT,
}

export enum TypeEnum {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
}
