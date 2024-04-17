import TradeController from "@/controllers/trade";
import Vue from "vue";

export default class OrderBook {
  market_id?: string;

  change_book_pool: { asks: { [key: string]: NodeJS.Timeout }, bids: { [key: string]: NodeJS.Timeout } } = {
    asks: {},
    bids: {}
  }

  constructor(market_id?: string) {
    this.market_id = market_id;
  }

  get book() {
    return TradeController.store.depth;
  }

  get sequence() {
    return this.book.sequence;
  }

  set sequence(sequence: number) {
    this.book.sequence = sequence
  }

  get loading() {
    return this.book.loading;
  }

  set loading(loading: boolean) {
    this.book.loading = loading;
  }

  async fetch(market_id: string, limit?: number) {
    this.loading = true;

    for (const side in this.change_book_pool) {
      for (const key in this.change_book_pool[side]) {
        clearTimeout(this.change_book_pool[side][key]);
        delete this.change_book_pool[side][key];
      }
    }

    this.market_id = market_id;

    try {
      this.clear();
      const { data } = await TradeController.get_depth(market_id, limit);
      const depth: { [key in ZTypes.TakerType]: string[][] } = data;
      this.loading = false;

      if (this.market_id != market_id) {
        return;
      }
      ["asks", "bids"].forEach((side: ZTypes.TakerType) => {
        depth[side].forEach(row => {
          const price = row[0];
          const amount = row[1];

          this.add(price, amount, side, false);
        })
      })
    } catch (error) {
      return error;
    } finally {
      this.loading = false;
    }
  }

  add(price: string, amount: string, side: ZTypes.TakerType, change = true) {
    if (this.change_book_pool[side][price] != null) {
      clearTimeout(this.change_book_pool[side][price]);
    }

    if (this.loading) return;
    const index = this.book[side].findIndex(row => row.price == price);
    if (index >= 0) {
      Vue.set(this.book[side][index], "amount", amount);
      Vue.set(this.book[side][index], "change", change);
    } else {
      Vue.set(this.book[side], this.book[side].length, { price, amount, change: change })

      this.book[side] = this.book[side].sort((a, b) => {
        if (side == "asks") return Number(a.price) - Number(b.price);
        if (side == "bids") return Number(b.price) - Number(a.price);
      });
    }

    if (!change) {
      return;
    }

    this.change_book_pool[side][price] = setTimeout(() => {
      const index = this.book[side].findIndex(row => row.price == price);
      if (index < 0) {
        return
      }

      Vue.delete(this.book[side][index], "change");
    }, 100);
  }

  remove(price: string, side: ZTypes.TakerType) {
    if (this.change_book_pool[side][price] != null) {
      clearTimeout(this.change_book_pool[side][price]);
    }
    if (this.loading) return;

    const index = this.book[side].findIndex(row => row.price == price);

    if (index >= 0) {
      Vue.delete(this.book[side], index);
    }
  }

  toArray(side: ZTypes.TakerType, limit = 100) {
    const orders = Array<{price: string; amount: string; change: boolean;}>();

    this.book[side].slice(0, limit).forEach(order => {
      orders.push({
        price: order.price,
        amount: order.amount,
        change: order.change,
      })
    })

    return orders;
  }

  clear() {
    this.book.asks = [];
    this.book.bids = [];
    this.book.sequence = 0;
  }
}
