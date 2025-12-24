/* eslint-disable ember/no-mixins */
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';

export default class RidesRoute extends AuthenticatedRoute {
  @service store;

  async model() {
    return this.store.findAll('ride');
  }
}
