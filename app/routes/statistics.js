import Route from '@ember/routing/route';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
  model() {
    return this.get('store').findAll('ride');
  },

  afterModel() {
    return this.get('store').findAll('reimbursement');
  },

  titleToken: 'Statistics',
});
