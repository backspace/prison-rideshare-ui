import Controller from '@ember/controller';

export default class GasPricesController extends Controller {
  get recentPrices() {
    let prices = Array.from(this.model);
    prices.sort((a, b) => b.insertedAt - a.insertedAt);
    return prices.slice(0, 10);
  }
}
