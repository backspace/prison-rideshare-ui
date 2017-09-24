import Ember from 'ember';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';

export default Ember.Route.extend(AuthenticatedRoute, {
  model() {
    return this.store.findAll('reimbursement');
  },

  afterModel(reimbursements) {
    // TODO coalesceFindRequests?
    return Ember.RSVP.all(reimbursements.mapBy('ride'));
  },

  titleToken: 'Reimbursements'
});
