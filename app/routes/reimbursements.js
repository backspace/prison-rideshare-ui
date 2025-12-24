/* eslint-disable ember/no-mixins */
import { inject as service } from '@ember/service';
import { all } from 'rsvp';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';

export default class ReimbursementsRoute extends AuthenticatedRoute {
  @service store;

  model() {
    return this.store.findAll('reimbursement');
  }

  afterModel(reimbursements) {
    // TODO coalesceFindRequests?
    return all(reimbursements.mapBy('ride'));
  }
}
