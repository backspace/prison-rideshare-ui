import Ember from 'ember';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';

export default Ember.Route.extend(AuthenticatedRoute, {
  model() {
    // FIXME this formerly used the people service but it wasn’t getting new records…
    return this.store.findAll('person');
  },

  titleToken: 'Drivers'
});
