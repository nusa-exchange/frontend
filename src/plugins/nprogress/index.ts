import { IsMobile } from "@/mixins";
import NProgress from "accessible-nprogress";

NProgress.settings.template = `
    <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="1">
      <div class="peg"></div>
    </div>
  `;

export const initProgress = router => {
  router.beforeEach((to, from, next) => {
    if (IsMobile()) return next();
    NProgress.start();
    return next();
  });
  router.afterEach(() => {
    if (IsMobile()) return;
    setTimeout(() => {
      NProgress.done();
    }, 100);
  });
};
