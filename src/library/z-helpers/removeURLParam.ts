export const removeURLParam = (url: string, param: string) => {
  const reg = new RegExp("((&)*" + param + "=([^&]*))", "g");
  return url.replace(reg, "");
};
