import { Currency } from ".";
import { UserController } from "@/controllers";

export class Balance {
  currency: string;

  getTotalBTC!: () => number;
  getTotalUSDT!: () => number;
  getTotalUSD!: () => number;

  getAvailableBTC!: () => void;
  getAvailableUSDT!: () => number;
  getAvailableUSD!: () => number;

  getLockedBTC!: () => number;
  getLockedUSDT!: () => number;
  getLockedUSD!: () => number;

  constructor(currency: string) {
    this.currency = currency;

    ["usdt", "usd", "btc"].forEach(currency_code => {
      ["total", "available", "locked"].forEach(type => {
        (this as any)[`get${type.capitalize()}${currency_code.toUpperCase()}`] = () => {
          const balance = (this as any)[type];

          return this.value_to_usd(balance);
        }
      })
    })
  }

  private get balances(): ZTypes.Balance[] {
    return UserController.balances;
  }

  get assets() {
    const balances = this.balances;

    return balances.find(balance => balance.currency === this.currency.toLowerCase());
  }

  get available() {
    return Number(this.assets?.balance).toFixedNumber(8) || 0;
  }

  get locked() {
    return Number(this.assets?.locked).toFixedNumber(8) || 0;
  }

  get total() {
    return (this.available + this.locked).toFixedNumber(8);
  }

  value_to_usdt(value: number) {
    const priceUSDT = new Currency(this.currency).getPriceByUSDT();

    return (value * priceUSDT).toFixedNumber(2);
  }

  value_to_btc(value: number) {
    const priceUSDT = new Currency(this.currency).getPriceByBTC();

    return (value * priceUSDT).toFixedNumber(8);
  }

  value_to_usd(value: number) {
    const priceUSDT = new Currency(this.currency).getPriceByUSD();

    return (value * priceUSDT).toFixedNumber(2);
  }
}
