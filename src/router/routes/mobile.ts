export default [
  {
    path: "/m",
    name: "Mobile",
    meta: { mobile: true },
    component: () => import("@/views/mobile/_index.vue"),
    children: [
      {
        path: "/",
        component: () => import("@/views/mobile/_home.vue"),
      },
      {
        path: "exchange",
        component: () => import("@/views/mobile/_exchange.vue"),
      },
      {
        path: "markets",
        component: () => import("@/views/mobile/_markets.vue"),
      },
      {
        path: "assets",
        component: () => import("@/views/mobile/_assets.vue"),
        meta: {
          requiresAuth: true,
        }
      }
    ],
  },
];
