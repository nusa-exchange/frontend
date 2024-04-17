/** @format */

import sparklines from "./core";
import { createCanvas, getContext } from "./share/canvas";

export { createCanvas, getContext };

if (typeof window !== "undefined" && !(window as any).sparklines) {
  (window as any).sparklines = sparklines;
}

export default sparklines;
