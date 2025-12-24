/* eslint-disable ember/no-mixins */
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';

export default class StatisticsRoute extends AuthenticatedRoute {
  @service store;

  model() {
    return this.store.findAll('ride');
  }

  afterModel() {
    return this.store.findAll('reimbursement');
  }
}
