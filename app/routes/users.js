import Ember from 'ember';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';

export default Ember.Route.extend(AuthenticatedRoute, {
  model() {
    return this.get('store').findAll('user');
  }
});