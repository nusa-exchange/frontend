import desktop from "./desktop";
import mobile from "./mobile";

export default [
  ...desktop,
  ...mobile,
  {
    path: "/*",
    name: "404 Page",
    component: () => import("@/views/desktop/404.vue")
  }
];
