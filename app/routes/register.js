import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class RegisterRoute extends Route {
  @service session;
  @service store;

  beforeModel() {
    this.session.prohibitAuthentication();
  }

  model() {
    return this.store.createRecord('user');
  }
}
