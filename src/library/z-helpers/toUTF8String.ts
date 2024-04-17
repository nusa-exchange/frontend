export const toUTF8String = (str: string) => {
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
