import { Picker, Slide, TabPanels, TabBar, RecycleList, DatePicker, Loading, Locale } from 'cube-ui';
import enUSMessages from "../../../node_modules/cube-ui/src/locale/lang/en-US.js";
import "cube-ui/lib/scroll/style.css";
import "cube-ui/lib/slide/style.css";
import "cube-ui/lib/scroll/style.css";
import "cube-ui/lib/recycle-list/style.css";
import "cube-ui/lib/loading/style.css";
import "cube-ui/lib/date-picker/style.css";
import "cube-ui/lib/picker/style.css";
import Vue from "vue";

Vue.use(TabPanels);
Vue.use(Picker);
Vue.use(Slide);
Vue.use(RecycleList);
Vue.use(Loading);
Vue.use(DatePicker);
Vue.use((Locale as any));

(Locale as any).use(enUSMessages);

(TabBar as any).mounted = function () {
  this._updateSliderStyle = function() {
    /* istanbul ignore if */
    if (!this.showSlider) return;
    const slider = this.$refs.slider;
    this.$nextTick(() => {
      const { width, index } = this._getSliderWidthAndIndex();
      slider.style.width = `16px`;
      this.setSliderTransform(this._getOffsetLeft(index) + width / 2 - 8);
    });
  }

  this._updateSliderStyle();
  window.addEventListener("resize", this._resizeHandler);
};


Vue.use(TabBar);

import CubeScroll from "./cube-scroll.vue";

Vue.component("cube-scroll", CubeScroll);
