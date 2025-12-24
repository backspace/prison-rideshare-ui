/* eslint-disable ember/no-mixins */
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';

export default class DriversRoute extends AuthenticatedRoute {
  @service store;

  model() {
    // FIXME this formerly used the people service but it wasn’t getting new records…
    return this.store.findAll('person');
  }

  afterModel() {
    // FIXME this is ridiculous, should just be sync relationships perhaps, or have last ride be computed by API
    return this.store.findAll('ride');
  }
}
