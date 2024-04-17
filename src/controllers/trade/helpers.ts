import { Store } from './store';

export default class Helpers {
  store: Store;

  constructor(store: Store) {
    this.store = store;
  }
}
