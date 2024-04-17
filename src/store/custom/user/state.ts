const state: UserState = {
  activity: {
    loading: false,
    max: 0,
    array: [],
    page: 1
  },
  api_keys: {
    loading: false,
    max: 0,
    array: [],
    page: 1
  },
  state: "",
  real_email: "",
  email: "",
  role: "",
  level: 0,
  otp: false,
  uid: "",
  need2fa: false,
  checkLogged: false,
  balance: [],
  session: {
    sended_email: false,
    password: "",
    reset_password_token: ""
  },
  phone: {
    number: "",
    country: "",
    validated: false
  },
  labels: [],
  reset_password_token: ""
};

export default state;
