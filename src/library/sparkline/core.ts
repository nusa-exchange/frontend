/** @format */

import bar from "./chart/bar";
import line from "./chart/line";
import pie from "./chart/pie";
import {
  // TypeEnum,
  CoreReturnFace,
  optionsDefault,
  OptionsFace
} from "./share/ast";
import { cloneDeep } from "./share/util";

const charts: any = {
  line,
  bar,
  pie,
};

const sparklines = (
  $el: Element,
  options: OptionsFace = optionsDefault
): CoreReturnFace => {
  const opts: OptionsFace = cloneDeep(optionsDefault, options);

  const { type } = opts;

  const { canvas } = (charts[type] as any)($el, opts);

  return {
    canvas,
    render: (
      $renderEl: Element,
      renderOptions: OptionsFace = optionsDefault
    ): void => {
      const optionsNew: OptionsFace = cloneDeep(optionsDefault, renderOptions);
      (charts[optionsNew.type] as any)($renderEl, optionsNew);
    },
  };
};

export default sparklines;
