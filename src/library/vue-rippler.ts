import { VueConstructor } from "vue/types/vue";

export default {
  install: function install(Vue: VueConstructor, options) {
    Vue.mixin({
      mounted: function mounted() {
        let bounce!: NodeJS.Timeout;
        let ripple!: HTMLElement;
        let rippleContainer!: HTMLElement;

        function debounce(func, delay) {
          return function() {
            const self = this;
            const args = arguments;

            clearTimeout(bounce);
            return (bounce = setTimeout(function() {
              return func.apply(self, args);
            }, delay));
          };
        }

        function makeRipple(e) {
          const setRipple = document.createElement("span");
          setRipple.className = "ripple--body";

          const size = ripple.offsetWidth,
            pos = ripple.getBoundingClientRect(),
            x = e.clientX - pos.left - size / 2,
            y = e.clientY - pos.top - size / 2,
            style =
              "will-change: top, left, height, width, auto; zoom: 1; top: " +
              y +
              "px; left: " +
              x +
              "px; height: " +
              size +
              "px; width: " +
              size +
              "px;";

          this.rippleContainer.appendChild(setRipple);

          return setRipple.setAttribute("style", style);
        }

        function removeRipple() {
          while (this.rippleContainer.firstChild)
            this.rippleContainer.removeChild(this.rippleContainer.firstChild);
        }

        const ripples = document.querySelectorAll("[ripple]");

        for (let i = 0; i < ripples.length; i++) {
          ripple = ripples[i] as HTMLElement;
          ripple.style.overflow = "hidden";
          ripple.style.position = "relative";

          rippleContainer = document.createElement("div");
          rippleContainer.className = "ripple--container";
          rippleContainer.style.overflow = "hidden";
          rippleContainer.style.position = "absolute";
          rippleContainer.style.transform = "translate3d(0, 0, 0)";
          rippleContainer.style.willChange = "top, left, right, bottom, auto";
          rippleContainer.style.top = "0";
          rippleContainer.style.left = "0";
          rippleContainer.style.right = "0";
          rippleContainer.style.bottom = "0";

          ripple.addEventListener("mousedown", makeRipple);
          ripple.addEventListener("mouseup", debounce(removeRipple, 2000));
          (ripple as any).rippleContainer = rippleContainer;
          ripple.appendChild(rippleContainer);
        }

        const styleEl = document.createElement("style");
        styleEl.id = "ripple-effect-style";
        if (!document.getElementById("ripple-effect-style"))
          document.head.appendChild(styleEl);
      },
    });
  },
};
