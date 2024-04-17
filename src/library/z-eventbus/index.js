/* eslint-disable no-prototype-builtins */
export default {
  on(ev, callback = null) {
    const evs = ev.split(" ");
    if (!this.hasOwnProperty("_callbacks") || !this._callbacks) {
      this._callbacks = {};
    }
    for (let name of Array.from(evs)) {
      if (!this._callbacks[name]) {
        this._callbacks[name] = [];
      }
      this._callbacks[name].push(callback);
    }
    return this;
  },

  emit(...args) {
    const ev = args.shift();
    const list =
      this.hasOwnProperty("_callbacks") &&
      (this._callbacks != null ? this._callbacks[ev] : undefined);
    if (!list) {
      return;
    }
    for (let callback of Array.from(list)) {
      if (callback.apply(this, args) === false) {
        break;
      }
    }
    return true;
  },

  listenTo(obj, ev, callback) {
    obj.on(ev, callback);
    if (!this.listeningTo) {
      this.listeningTo = [];
    }
    this.listeningTo.push({ obj, ev, callback });
    return this;
  },

  listenToOnce(obj, ev, callback) {
    let handler;
    const listeningToOnce = this.listeningToOnce || (this.listeningToOnce = []);
    obj.on(
      ev,
      (handler = function() {
        let idx = -1;
        for (let i = 0; i < listeningToOnce.length; i++) {
          const lt = listeningToOnce[i];
          if (lt.obj === obj) {
            if (lt.ev === ev && lt.callback === callback) {
              idx = i;
            }
          }
        }
        obj.remove(ev, handler);
        if (idx !== -1) {
          listeningToOnce.splice(idx, 1);
        }
        return callback.apply(this, arguments);
      })
    );
    listeningToOnce.push({ obj, ev, callback, handler });
    return this;
  },

  stopListening(obj, events, callback) {
    let listeningTo, lt;
    if (arguments.length === 0) {
      for (listeningTo of [this.listeningTo, this.listeningToOnce]) {
        if (!listeningTo) {
          continue;
        }
        for (lt of Array.from(listeningTo)) {
          lt.obj.remove(lt.ev, lt.handler || lt.callback);
        }
      }
      this.listeningTo = undefined;
      return (this.listeningToOnce = undefined);
    } else if (obj) {
      return (() => {
        const result = [];
        for (listeningTo of [this.listeningTo, this.listeningToOnce]) {
          if (!listeningTo) {
            continue;
          }
          events = events ? events.split(" ") : [undefined];
          result.push(
            (() => {
              const result1 = [];
              for (var ev of Array.from(events)) {
                result1.push(
                  (() => {
                    const result2 = [];
                    for (
                      let start = listeningTo.length - 1,
                        idx = start,
                        asc = start <= 0;
                      asc ? idx <= 0 : idx >= 0;
                      asc ? idx++ : idx--
                    ) {
                      lt = listeningTo[idx];
                      if (
                        callback &&
                        (lt.handler || lt.callback) !== callback
                      ) {
                        continue;
                      }
                      if (!ev || ev === lt.ev) {
                        lt.obj.remove(lt.ev, lt.handler || lt.callback);
                        if (idx !== -1) {
                          result2.push(listeningTo.splice(idx, 1));
                        } else {
                          result2.push(undefined);
                        }
                      } else if (ev) {
                        let evts = lt.ev.split(" ");
                        if (Array.from(evts).includes(ev)) {
                          evts = Array.from(evts).filter(e => e !== ev);
                          lt.ev = evts.join(" ").trim();
                          result2.push(
                            lt.obj.remove(ev, lt.handler || lt.callback)
                          );
                        } else {
                          result2.push(undefined);
                        }
                      } else {
                        result2.push(undefined);
                      }
                    }
                    return result2;
                  })()
                );
              }
              return result1;
            })()
          );
        }
        return result;
      })();
    }
  },

  remove(ev, callback) {
    if (arguments.length === 0) {
      this._callbacks = {};
      return this;
    }
    if (!ev) {
      return this;
    }
    const evs = ev.split(" ");
    for (let name of Array.from(evs)) {
      let list = this._callbacks != null ? this._callbacks[name] : undefined;
      if (!list) {
        continue;
      }
      if (!callback) {
        delete this._callbacks[name];
        continue;
      }
      for (let i = 0; i < list.length; i++) {
        const cb = list[i];
        if (cb === callback) {
          list = list.slice();
          list.splice(i, 1);
          this._callbacks[name] = list;
          break;
        }
      }
    }
    return this;
  }
};
