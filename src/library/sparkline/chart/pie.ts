/** @format */

import { CoreReturnFace, optionsDefault, OptionsFace } from "../share/ast";
import {
  calculateanvasSize,
  createCanvas,
  drawCircle,
  drawPieSlice
} from "../share/canvas";
import { isNumber, isString } from "../share/type";

const drawPiesSlice = (
  canvas: any,
  options: OptionsFace,
  valuenum: number,
  radius: number
): void => {
  const { values, offset, borderWidth, sliceColors, padding } = options;
  const total =
    values.length > 0
      ? values.reduce((acc: number, val: number): number => acc + val, 0)
      : 0;
  let next = offset ? 2 * Math.PI * (offset / 360) : 0;
  const circle = 2 * Math.PI;
  let start = 0;
  let end = 0;
  let color = "";

  values.forEach((val: number, valIdx: number): void => {
    start = next;
    end = next;
    if (total > 0) {
      // avoid divide by zero
      end = next + circle * (val / total);
    }
    if (valuenum === valIdx) {
      color = sliceColors[valIdx % sliceColors.length];
      drawPieSlice({
        canvas,
        x: radius + padding * 2,
        y: radius + padding * 2,
        radius: radius - borderWidth,
        startAngle: start,
        endAngle: Math.ceil(end),
        lineColor: "",
        fillColor: color,
      });
    }
    next = end;
  });
};

const render = ($el: any, canvas: any, options: OptionsFace): void => {
  const { borderWidth, borderColor, values, padding } = options;
  const { canvasWidth, canvasHeight } = calculateanvasSize($el, options);
  const radius = Math.floor(Math.min(canvasWidth, canvasHeight) / 2);
  const newRadius = radius - padding * 2;

  // 画边框
  if (isNumber(borderWidth) && borderWidth > 0) {
    drawCircle({
      canvas,
      x: newRadius,
      y: newRadius,
      radius: Math.floor(newRadius - borderWidth / 2),
      lineColor: isString(borderColor) ? borderColor : "",
      fillColor: "",
      lineWidth: 1,
    });
  }
  // 画饼
  let valIdx = values.length;
  while (valIdx > -1) {
    drawPiesSlice(canvas, options, valIdx, newRadius);
    valIdx--;
  }
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
