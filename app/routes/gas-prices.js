import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class GasPricesRoute extends Route {
  @service store;

  model() {
    return this.store.findAll('gas-price');
  }
}
