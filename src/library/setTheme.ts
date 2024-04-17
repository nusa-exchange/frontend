export default class setTheme {
  element: HTMLElement = document.querySelector("html");

  set(prop, val) {
    return this.element.style.setProperty(prop, val);
  }

  get(val) {
    return getComputedStyle(this.element).getPropertyValue(val);
  }

  setTheme(theme) {
    return Object.keys(theme).forEach(key => {
      return this.set("--" + key, theme[key]);
    });
  }
}