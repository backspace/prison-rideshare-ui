/* eslint-disable ember/no-mixins */
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';

export default class DebtsRoute extends AuthenticatedRoute {
  @service store;

  model() {
    return this.store.findAll('debt');
  }
}
