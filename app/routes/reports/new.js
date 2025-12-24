import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class NewRoute extends Route {
  @service
  store;

  model() {
    return this.store.findAll('ride', { reload: true });
  }
}
