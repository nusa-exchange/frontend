import isArray from "isarray";
import isObject from 'isobject';

export default {
  createCanvas(height, width, parent_element: HTMLElement | Element) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const pixelRatio = this.getPixelRatio(ctx);

    canvas.height = height * pixelRatio;
    canvas.width = width * pixelRatio;
    canvas.style.height = height + "px";
    canvas.style.width = width + "px";

    ctx.scale(pixelRatio, pixelRatio);

    parent_element.appendChild(canvas);

    return canvas;
  },
  resizeCanvas(canvas: HTMLCanvasElement, height: number, width: number, callback?: () => void) {
    const context = canvas.getContext("2d");
    const pixelRatio = this.getPixelRatio(context);

    context.resetTransform();

    canvas.height = height * pixelRatio;
    canvas.style.height = height + "px";
    canvas.style.width = width + "px";
    canvas.width = width * pixelRatio;
    canvas.style.height = height + "px";
    canvas.style.width = width + "px";

    context.scale(pixelRatio, pixelRatio);

    if (typeof callback === "function") callback();
  },
  getPixelRatio(ctx) {
    const backingStore = ctx.backingStorePixelRatio ||
      ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio || 1
    return (window.devicePixelRatio || 1) / backingStore
  },
  getContext2D(element: HTMLCanvasElement) {
    if (element) {
      const context = element.getContext("2d")

      return context;
    }

    return null;
  },
  isEmpty(depth) {
    return !depth.buy.length || !depth.sell.length;
  },
  toPretty(num) {
    num = num || 0;
    if (num < 1000) {
      return num.toFixed(2);
    } else if (num < 1e6) {
      return (num / 1e3).toFixed(2) + " K";
    } else if (num < 1e7) {
      return (num / 1e6).toFixed(2) + " M";
    } else if (num < 1e9) {
      return (num / 1e6).toFixed(2) + " M";
    } else if (num < 1e10) {
      return (num / 1e9).toFixed(2) + " B";
    }
    return (num / 1e9).toFixed(0) + " B";
  },
  toThousand(num = 0) {
    if (typeof num === "undefined") {
      return "0";
    }
    return (num || 0).toString().replace(/\d+/, (n) => {
      const len = n.length;
      if (len % 3 === 0) {
        return n.replace(/(\d{3})/g, ",$1").slice(1);
      } else {
        return (
          n.slice(0, len % 3) + n.slice(len % 3).replace(/(\d{3})/g, ",$1")
        );
      }
    });
  },
  clearCanvas(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width;
    canvas.width = 1;
    canvas.width = w;
  },
  merge(target, source) {
    if (!isObject(target) || !isObject(source)) {
      return;
    }
  
    for (const key in source) {
      if (Object.prototype.isPrototypeOf.call(target, key)) {
        const targetProp = target[key];
        const sourceProp = source[key];
  
        if (isObject(sourceProp) && isObject(targetProp) && !isArray(sourceProp) && !isArray(targetProp)) {
          this.merge(targetProp, sourceProp);
        } else {
          if (source[key] || source[key] === 0 || source[key] === false) {
            target[key] = source[key];
          }
        }
      }
    }
  }
};
