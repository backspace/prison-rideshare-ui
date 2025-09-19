import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

@classic
export default class GasPricesRoute extends Route {
  @service
  store;

  model() {
    return this.store.findAll('gas-price');
  }

  titleToken = 'Gas prices';
}
