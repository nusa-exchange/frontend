/** @format */

import { CoreReturnFace, optionsDefault, OptionsFace } from "../share/ast";
import {
  calculateanvasSize,
  createCanvas,
  drawRect,
  RectFace
} from "../share/canvas";
import { isNumber } from "../share/type";

interface ScanValuesFace {
  numValues: number[];
  max: number;
  min: number;
  canvasHeightEf: number;
  xAxisOffset: number;
  yOffset: number;
  range: number;
}

const scanValues = (
  $el: any,
  values: number[],
  options: OptionsFace
): ScanValuesFace => {
  const { canvasHeight } = calculateanvasSize($el, options);
  const { zeroAxis } = options;
  const numValues: number[] = [];
  let xAxisOffset = 0;

  values.forEach((val: number) => {
    numValues.push(isNumber(val) ? val : 0);
  });
  const max = Math.max(...numValues);
  const min = Math.min(...numValues);

  if (min <= 0 && max >= 0 && zeroAxis) {
    xAxisOffset = 0;
  } else if (zeroAxis === false) {
    xAxisOffset = min;
  } else if (min > 0) {
    xAxisOffset = min;
  } else {
    xAxisOffset = max;
  }

  const range = max - min;
  const canvasHeightEf =
    zeroAxis && min < 0 ? canvasHeight - 2 : canvasHeight - 1;
  let yOffset = 0;

  if (min < xAxisOffset) {
    yOffset = ((max - xAxisOffset) / range) * canvasHeight;

    if (yOffset !== Math.ceil(yOffset)) {
      // canvasHeightEf -= 2;
      yOffset = Math.ceil(yOffset);
    }
  } else {
    yOffset = canvasHeight;
  }

  return {
    numValues,
    max,
    min,
    canvasHeightEf,
    xAxisOffset,
    yOffset,
    range,
  };
};

const getColor = (value: number, options: OptionsFace): string => {
  const { barColor, negBarColor, zeroColor } = options;
  let color = value < 0 ? negBarColor : barColor;

  if (value === 0) {
    color = zeroColor;
  }

  return color;
};

// 获取路径
const getbars = (options: OptionsFace, valConf: ScanValuesFace): RectFace[] => {
  const bars: RectFace[] = [];
  const { barWidth, barSpacing, padding, zeroAxis } = options;
  const { numValues, canvasHeightEf, xAxisOffset, yOffset, range } = valConf;
  const totalBarWidth = barWidth + barSpacing;
  const yOffsetNeg = yOffset;
  const yOffsetNew = yOffset;

  numValues.forEach((val: number, valIdx: number) => {
    const startX = valIdx * totalBarWidth;
    let height = 0;
    let startY = 0;
    const color = getColor(val, options);

    if (range > 0) {
      height =
        Math.floor(canvasHeightEf * (Math.abs(val - xAxisOffset) / range)) + 1;
    } else {
      height = 1 + padding;
    }
    if (val < xAxisOffset || (val === xAxisOffset && yOffsetNew === 0)) {
      startY = yOffsetNeg;
    } else {
      startY = yOffsetNew - height;
    }

    let space = 0;

    if (zeroAxis) {
      if (val > 0) {
        space = -1;
      } else {
        space = 3;
      }
    } else if (val < 0) {
      space = 2;
    } else if (val === 0) {
      space = padding;
    } else {
      space = padding + (padding ? 1 : 0);
    }

    let startYNew = val > 0 ? startY - 1 + padding : startY + 1;
    if (!zeroAxis && padding) {
      if (val < 0) {
        startYNew -= padding + 1;
      } else {
        startYNew += 1;
      }
    }

    const bar: RectFace = {
      startX: startX + padding,
      startY: startYNew,
      height: height - space - padding,
      width: barWidth - 1,
      color,
    };

    bars.push(bar);
  });

  return bars;
};

const drawBars = (canvas: any, bars: RectFace[]): void => {
  bars.forEach((bar: RectFace) => {
    const { startX, startY, height, width, color } = bar;
    drawRect({
      canvas,
      path: [
        [startX, startY],
        [startX + width, startY],
        [startX + width, startY + height],
        [startX, startY + height],
        [startX, startY],
      ],
      lineColor: color,
      fillColor: color,
      lineWidth: 1,
    });
  });
};

const render = ($el: any, canvas: any, options: OptionsFace): void => {
  const { values } = options;
  const valConf = scanValues($el, values, options);
  const bars = getbars(options, valConf);
  drawBars(canvas, bars);
};

export default (
  $el: Element,
  options: OptionsFace = optionsDefault
): CoreReturnFace => {
  const canvas = createCanvas($el, options);
  render($el, canvas, options);

  return {
    canvas,
    render,
  };
};
