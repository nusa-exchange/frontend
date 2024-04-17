export default [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/desktop/_home.vue")
  },
  {
    path: "/exchange/:name",
    name: "ExchangePage",
    component: () => import("@/views/desktop/exchange.vue")
  },
  {
    path: "/signin",
    name: "signin",
    component: () => import("@/views/desktop/_signin.vue"),
    meta: {
      guest: true
    }
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("@/views/desktop/_signup.vue"),
    meta: {
      guest: true
    }
  },
  {
    path: "/account",
    name: "account",
    component: () => import("@/views/desktop/_account.vue"),
    children: [
      {
        path: "information",
        component: () => import("@/views/desktop/account/_information.vue")
      },
      {
        path: "security",
        component: () => import("@/views/desktop/account/_security.vue")
      },
      {
        path: "kyc",
        component: () => import("@/views/desktop/account/kyc")
      },
      {
        path: "history",
        component: () => import("@/views/desktop/account/_history.vue")
      },
      {
        path: "api",
        component: () => import("@/views/desktop/account/_api.vue")
      }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/assets",
    component: () => import("@/views/desktop/_assets.vue"),
    children: [
      {
        path: "balance",
        component: () => import("@/views/desktop/assets/_balance.vue")
      },
      {
        path: "history",
        component: () => import("@/views/desktop/assets/_history.vue")
      }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/exchange_record",
    component: () => import("@/views/desktop/_exchange_record.vue"),
    children: [
      {
        path: "open",
        component: () => import("@/views/desktop/exchange_record/_open.vue")
      },
      {
        path: "history",
        component: () => import("@/views/desktop/exchange_record/_history.vue")
      },
      {
        path: "transaction",
        component: () =>
          import("@/views/desktop/exchange_record/_transaction.vue")
      }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/confirmation/email",
    name: "Confirmation Email",
    component: () => import("@/views/desktop/confirmation_email.vue"),
    meta: {
      requiresAuthStatePending: true
    }
  },
  {
    path: "/forgotpassword",
    name: "ForgotPassword",
    component: () => import("@/views/desktop/_forgotpassword.vue"),
    meta: {
      guest: true
    }
  },
  {
    path: "/referral",
    name: "Referral",
    component: () => import("@/views/desktop/referral.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/ieo/list",
    name: "IEO List Page",
    component: () => import("@/views/desktop/ieo_list.vue")
  },
  {
    path: "/ieo/:id",
    name: "IEO Page",
    component: () => import("@/views/desktop/ieo.vue")
  },
];
