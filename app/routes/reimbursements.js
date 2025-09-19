/* eslint-disable ember/no-classic-classes, ember/no-mixins */
import { all } from 'rsvp';
import Route from '@ember/routing/route';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';
import { inject as service } from '@ember/service';

export default Route.extend(AuthenticatedRoute, {
  store: service(),

  model() {
    return this.store.findAll('reimbursement');
  },

  afterModel(reimbursements) {
    // TODO coalesceFindRequests?
    return all(reimbursements.mapBy('ride'));
  },

  titleToken: 'Reimbursements',
});
