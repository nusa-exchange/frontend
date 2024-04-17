import ErrorCorrectLevel from "qr.js/lib/ErrorCorrectLevel";
import QRCode from "qr.js/lib/QRCode";

const toUTF8String = (str: string) => {
  let utf8Str = "";
  for (let i = 0; i < str.length; i++) {
    let charCode = str.charCodeAt(i);
    if (charCode < 0x0080) {
      utf8Str += String.fromCharCode(charCode);
    } else if (charCode < 0x0800) {
      utf8Str += String.fromCharCode(0xc0 | (charCode >> 6));
      utf8Str += String.fromCharCode(0x80 | (charCode & 0x3f));
    } else if (charCode < 0xd800 || charCode >= 0xe000) {
      utf8Str += String.fromCharCode(0xe0 | (charCode >> 12));
      utf8Str += String.fromCharCode(0x80 | ((charCode >> 6) & 0x3f));
      utf8Str += String.fromCharCode(0x80 | (charCode & 0x3f));
    } else {
      i++;
      charCode =
        0x10000 + (((charCode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      utf8Str += String.fromCharCode(0xf0 | (charCode >> 18));
      utf8Str += String.fromCharCode(0x80 | ((charCode >> 12) & 0x3f));
      utf8Str += String.fromCharCode(0x80 | ((charCode >> 6) & 0x3f));
      utf8Str += String.fromCharCode(0x80 | (charCode & 0x3f));
    }
  }
  return utf8Str;
};

const getBackingStorePixelRatio = ctx => {
  return (
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1
  );
};

export default {
  render(createElement) {
    const { value, level, background, foreground, size } = this;

    return createElement(
      "div",
      {
        class: "main-qr",
        attrs: { value, level, background, foreground }
      },
      [
        createElement(
          "canvas",
          {
            attrs: { height: size, width: size },
            style: { width: size + "px", height: size + "px" },
            ref: "qrcode"
          },
          []
        )
      ]
    );
  },
  props: {
    value: {
      type: String,
      required: true,
      default: ""
    },
    size: {
      type: [Number, String],
      default: 100,
      validator: s => isNaN(Number(s)) !== true
    },
    level: {
      type: String,
      default: "L",
      validator: l => ["L", "Q", "M", "H"].indexOf(l) > -1
    },
    background: {
      type: String,
      default: "#fff"
    },
    foreground: {
      type: String,
      default: "#000"
    }
  },
  methods: {
    render() {
      const { value, size, level, background, foreground } = this;
      const _size = size >>> 0; // size to number

      // We'll use type===-1 to force QRCode to automatically pick the best type
      const qrCode = new QRCode(-1, ErrorCorrectLevel[level]);
      qrCode.addData(toUTF8String(value));
      qrCode.make();

      const canvas = this.$refs["qrcode"];

      const ctx = canvas.getContext("2d");
      const cells = qrCode.modules;
      const tileW = _size / cells.length;
      const tileH = _size / cells.length;
      const scale =
        (window.devicePixelRatio || 1) / getBackingStorePixelRatio(ctx);
      canvas.height = canvas.width = _size * scale;
      ctx.scale(scale, scale);

      cells.forEach(function(row, rdx) {
        row.forEach(function(cell, cdx) {
          ctx.fillStyle = cell ? foreground : background;
          const w = Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW);
          const h = Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH);
          ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h);
        });
      });
    }
  },
  updated() {
    this.render();
  },
  mounted() {
    this.render();
  }
};
