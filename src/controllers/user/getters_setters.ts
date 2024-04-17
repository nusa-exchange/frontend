import { Store } from './store';

export default class GettersSetters {
  store!: Store;

  get state() {
    return this.store.state;
  }

  set state(state) {
    this.store.state = state;
  }

  get isAuth() {
    return this.state == "active";
  }

  get email() {
    return this.store.email;
  }

  set email(email) {
    this.store.email = email;
  }

  get uid() {
    return this.store.uid;
  }

  set uid(uid) {
    this.store.uid = uid;
  }

  get level() {
    return this.store.level;
  }

  set level(level) {
    this.store.level = level;
  }

  get role() {
    return this.store.role;
  }

  set role(role) {
    this.store.role = role;
  }

  get otp() {
    return this.store.otp;
  }

  set otp(otp) {
    this.store.otp = otp;
  }

  get phone() {
    return this.store.phone;
  }

  set phone(phone) {
    this.store.phone = phone;
  }

  get labels() {
    return this.store.labels
  }

  set labels(labels) {
    this.store.labels = labels;
  }

  get balances() {
    return this.store.balances;
  }

  set balances(balances: ZTypes.Balance[]) {
    this.store.balances = balances;
  }

  get need2fa() {
    return this.store.need2fa;
  }

  set need2fa(need2fa) {
    this.store.need2fa = need2fa;
  }

  get session() {
    return this.store.session;
  }

  set session(session) {
    this.store.session = session;
  }
}
