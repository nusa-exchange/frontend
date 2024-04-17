/* eslint-disable no-prototype-builtins */
export const jsonToParam = (json: any, first_str = "?") => {
  const parts = [];
  for (const i in json) {
    if (json.hasOwnProperty(i) && json[i]) {
      parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(json[i]));
    }
  }
  return parts.length ? first_str + parts.join("&") : "";
};
