/** @format */

import {
  CoreReturnFace,
  optionsDefault,
  OptionsFace,
  PointEnum
} from "../share/ast";
import {
  calculateanvasSize,
  CalculateanvasSizeFace,
  createCanvas,
  drawCircle,
  drawShape
} from "../share/canvas";
import { isNumber } from "../share/type";

interface SCanValuesFace {
  xValues: number[];
  yValues: number[];
  yminmax: number[];
  maxX: number;
  minX: number;
  minY: number;
  maxY: number;
  maxYOrg: number;
  minYOrg: number;
}

// 处理 values
const scanValues = (values: number[]): SCanValuesFace => {
  const xValues: number[] = [];
  const yValues: number[] = [];
  const yminmax: number[] = [];

  values.forEach((val: number, valIdx: number) => {
    xValues.push(valIdx);
    if (isNumber(val)) {
      yValues.push(Number(val));
      yminmax.push(Number(val));
    } else {
      yValues.push(0);
    }
  });

  const maxX = Math.max(...xValues);
  const minX = Math.min(...xValues);

  const maxYOrg = Math.max(...yminmax);
  const maxY = maxYOrg;
  const minYOrg = Math.min(...yminmax);
  const minY = minYOrg;

  return {
    xValues,
    yValues,
    yminmax,
    maxX,
    minX,
    maxY,
    maxYOrg,
    minY,
    minYOrg,
  };
};

interface AdpCanvasFace extends CalculateanvasSizeFace {
  canvasTop: number;
  canvasLeft: number;
}
// 获取 canvas 的大小和位置
const getCanvas = (
  $el: any,
  options: OptionsFace,
  yValues: number[],
  minY: number,
  maxY: number
): AdpCanvasFace => {
  let { canvasWidth, canvasHeight } = calculateanvasSize($el, options);
  let { spotRadius } = options;
  const { padding } = options;
  const yValLast = yValues.length - 1;
  let canvasTop = 0;
  let canvasLeft = 0;

  if (
    spotRadius &&
    (canvasWidth < spotRadius * 4 || canvasHeight < spotRadius * 4)
  ) {
    spotRadius = 0;
  }

  // 绘制点
  if (spotRadius) {
    // adjust the canvas size as required so that spots will fit
    const {
      minSpotColor,
      spotColor,
      maxSpotColor,
      highlightSpotColor,
      disableInteraction,
    } = options;
    const hlSpotsEnabled = highlightSpotColor && !disableInteraction;

    if (
      hlSpotsEnabled ||
      minSpotColor ||
      (spotColor && yValues[yValLast] === minY)
    ) {
      canvasHeight -= Math.ceil(spotRadius) + padding;
    }
    if (
      hlSpotsEnabled ||
      maxSpotColor ||
      (spotColor && yValues[yValLast] === maxY)
    ) {
      canvasHeight -= Math.ceil(spotRadius) + padding;
      canvasTop += Math.ceil(spotRadius) + padding;
    }
    if (
      hlSpotsEnabled ||
      ((minSpotColor || maxSpotColor) &&
        (yValues[0] === minY || yValues[0] === maxY))
    ) {
      canvasLeft += padding; // 左边的间距
      canvasWidth -= Math.ceil(spotRadius) + padding;
    }
    if (
      hlSpotsEnabled ||
      spotColor ||
      minSpotColor ||
      (maxSpotColor &&
        (yValues[yValLast] === minY || yValues[yValLast] === maxY))
    ) {
      canvasWidth -= Math.ceil(spotRadius) + padding;
    }
  } else {
    canvasWidth -= padding * 2;
    canvasHeight -= padding * 2;
    canvasLeft += padding;
    canvasTop += padding;
  }

  return {
    canvasWidth,
    canvasHeight,
    canvasLeft,
    canvasTop,
  };
};

export interface PathFace {
  paths: number[][][];
  vertices: number[][];
  regionMap: number[][];
}

// 获取路径
export const getPaths = (
  xValues: number[],
  yValues: number[],
  canvasLeft: number,
  canvasWidth: number,
  canvasTop: number,
  canvasHeight: number,
  minX: number,
  minY: number,
  maxY: number,
  rangeX: number,
  rangeY: number
): PathFace => {
  let path: number[][] = [];
  const paths = [path];
  const vertices: number[][] = [];
  const regionMap: number[][] = [];
  let last = 0;
  let next = 0;
  let x = 0;
  let xNext = 0;
  let y = 0;
  let xPos = 0;
  let xPosNext = 0;
  const yValcount: number = yValues.length;

  yValues.forEach((yValueItem: number, yValueIdx: number) => {
    x = xValues[yValueIdx];
    xNext = xValues[yValueIdx + 1];
    y = yValueItem;
    xPos = canvasLeft + Math.round((x - minX) * (canvasWidth / rangeX));
    xPosNext =
      yValueIdx < yValcount - 1
        ? canvasLeft + Math.round((xNext - minX) * (canvasWidth / rangeX))
        : canvasWidth;
    next = xPos + (xPosNext - xPos) / 2;
    regionMap[yValueIdx] = [last || 0, next, yValueIdx];
    last = next;

    if (y === null) {
      if (yValueIdx) {
        if (yValues[yValueIdx - 1] !== null) {
          path = [];
          paths.push(path);
        }
        vertices.push([]);
      }
    } else {
      if (y < minY) {
        y = minY;
      }
      if (y > maxY) {
        y = maxY;
      }
      if (!path.length) {
        // previous value was null
        path.push([xPos, canvasTop + canvasHeight]);
      }
      const verteX = [
        xPos,
        canvasTop +
          Math.round(canvasHeight - canvasHeight * ((y - minY) / rangeY)),
      ];
      path.push(verteX);
      vertices.push(verteX);
    }
  });

  return {
    paths,
    vertices,
    regionMap,
  };
};

interface ShapesFace {
  lineShapes: number[][][];
  fillShapes: number[][][];
}

// 获取线和填充的集合
const getShapes = (
  paths: number[][][],
  fillColor: string,
  canvasTop: number,
  canvasHeight: number
): ShapesFace => {
  const lineShapes: number[][][] = [];
  const fillShapes: number[][][] = [];

  paths.forEach((path: number[][]) => {
    if (path.length) {
      if (fillColor) {
        path.push([
          path[path.length - 1][PointEnum.START_POINT],
          canvasTop + canvasHeight,
        ]);
        fillShapes.push(path.slice(0));
        path.pop();
      }
      // if there's only a single point in this path, then we want to display it
      // as a vertical line which means we keep path[0]  as is
      if (path.length > 2) {
        // else we want the first value
        path[0] = [
          path[0][PointEnum.START_POINT],
          path[1][PointEnum.END_POINT],
        ];
      }
      lineShapes.push(path);
    }
  });

  return {
    lineShapes,
    fillShapes,
  };
};

// 画线或者填充
const drawLines = (
  canvas: any,
  fillShapes: number[][][],
  lineColor: string,
  fillColor: string,
  lineWidth: number
): void => {
  fillShapes.forEach((fillShapeItem) => {
    drawShape({
      canvas,
      path: fillShapeItem,
      lineColor,
      fillColor,
      lineWidth,
    });
  });
};

interface ValueTag {
  canvas: any;
  xValues: number[];
  yValues: number[];
  spotRadius: number;
  lineWidth: number;
  canvasWidth: number;
  canvasHeight: number;
  canvasLeft: number;
  canvasTop: number;
  minX: number;
  rangeX: number;
  minY: number;
  rangeY: number;
}

interface FinalValueTagFace extends ValueTag {
  spotColor: string;
}

// 最终值标记
const finalValueTag = ({
  canvas,
  xValues,
  yValues,
  spotRadius,
  lineWidth,
  canvasWidth,
  canvasHeight,
  canvasLeft,
  canvasTop,
  minX,
  rangeX,
  minY,
  rangeY,
  spotColor,
}: FinalValueTagFace): void => {
  const yValLast = yValues[yValues.length - 1];
  const pointX =
    canvasLeft +
    Math.round((xValues[xValues.length - 1] - minX) * (canvasWidth / rangeX));
  const pointY =
    canvasTop +
    Math.round(canvasHeight - canvasHeight * ((yValLast - minY) / rangeY));

  if (spotRadius && spotColor && yValLast !== null) {
    drawCircle({
      canvas,
      lineColor: spotColor,
      fillColor: spotColor,
      lineWidth,
      x: pointX,
      y: pointY,
      radius: spotRadius,
    });
  }
};

interface MinMaxValueTagFace extends ValueTag {
  maxY: number;
  maxSpotColor: string;
  minSpotColor: string;
  minYOrg: number;
  maxYOrg: number;
}

// 最大最小值标记
const minMaxValueTag = ({
  canvas,
  xValues,
  yValues,
  spotRadius,
  lineWidth,
  canvasWidth,
  canvasHeight,
  canvasLeft,
  canvasTop,
  minX,
  rangeX,
  minY,
  rangeY,
  maxY,
  maxSpotColor,
  minSpotColor,
  minYOrg,
  maxYOrg,
}: MinMaxValueTagFace): void => {
  if (maxY !== minYOrg) {
    if (spotRadius && minSpotColor) {
      const x = xValues[yValues.findIndex((yVal) => yVal === minYOrg)];
      drawCircle({
        canvas,
        lineColor: minSpotColor,
        fillColor: minSpotColor,
        lineWidth,
        x: canvasLeft + Math.round((x - minX) * (canvasWidth / rangeX)),
        y:
          canvasTop +
          Math.round(canvasHeight - canvasHeight * ((minYOrg - minY) / rangeY)),
        radius: spotRadius,
      });
    }
    if (spotRadius && maxSpotColor) {
      const x = xValues[yValues.findIndex((yVal) => yVal === maxYOrg)];
      drawCircle({
        canvas,
        lineColor: maxSpotColor,
        fillColor: maxSpotColor,
        lineWidth,
        x: canvasLeft + Math.round((x - minX) * (canvasWidth / rangeX)),
        y:
          canvasTop +
          Math.round(canvasHeight - canvasHeight * ((maxYOrg - minY) / rangeY)),
        radius: spotRadius,
      });
    }
  }
};

const render = ($el: Element, canvas: any, options: OptionsFace): void => {
  const {
    lineColor,
    fillColor,
    lineWidth,
    spotRadius,
    spotColor,
    maxSpotColor,
    minSpotColor,
    values,
  } = options;
  const {
    xValues,
    yValues,
    yminmax,
    maxX,
    minX,
    maxY,
    minY,
    minYOrg,
    maxYOrg,
  } = scanValues(values);
  const rangeX = maxX - minX === 0 ? 1 : maxX - minX;
  const rangeY = maxY - minY === 0 ? 1 : maxY - minY;

  if (!yminmax.length || yValues.length < 2) {
    // empty or all null valuess
    return;
  }

  const { canvasWidth, canvasHeight, canvasLeft, canvasTop } = getCanvas(
    $el,
    options,
    yValues,
    minY,
    maxY
  );

  let newCavasHeight = canvasHeight;

  newCavasHeight--;

  const {
    paths,
    // vertices,
    // regionMap,
  } = getPaths(
    xValues,
    yValues,
    canvasLeft,
    canvasWidth,
    canvasTop,
    newCavasHeight,
    minX,
    minY,
    maxY,
    rangeX,
    rangeY
  );

  const { lineShapes, fillShapes } = getShapes(
    paths,
    fillColor,
    canvasTop,
    newCavasHeight
  );

  drawLines(canvas, fillShapes, fillColor, fillColor, lineWidth);
  drawLines(canvas, lineShapes, lineColor, "", lineWidth);

  const valueTag = {
    canvas,
    xValues,
    yValues,
    spotRadius,
    lineWidth,
    canvasWidth,
    canvasHeight,
    canvasLeft,
    canvasTop,
    minX,
    rangeX,
    minY,
    rangeY,
  };

  finalValueTag({
    ...valueTag,
    spotColor,
  });

  minMaxValueTag({
    ...valueTag,
    maxY,
    maxSpotColor,
    minSpotColor,
    minYOrg,
    maxYOrg,
  });
};

export default (
  $el: Element,
  options: OptionsFace = optionsDefault
): CoreReturnFace => {
  const canvas: Element = createCanvas($el, options);
  render($el, canvas, options);

  return {
    canvas,
    render,
  };
};
