import { all } from 'rsvp';
import Route from '@ember/routing/route';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
  model() {
    return this.store.findAll('reimbursement');
  },

  afterModel(reimbursements) {
    // TODO coalesceFindRequests?
    return all(reimbursements.mapBy('ride'));
  },

  titleToken: 'Reimbursements',
});
