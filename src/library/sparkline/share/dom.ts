/** @format */

import { isString } from "./type";
import { getStyle, StyleFace } from "./util";

export const css = ($el: any, params: StyleFace | string): string | void => {
  if (isString(params)) {
    return getStyle($el)[params as string];
  }
  Object.keys(params).forEach((paramsKey) => {
    $el.style[paramsKey] = (params as StyleFace)[paramsKey];
  });

  return "";
};
