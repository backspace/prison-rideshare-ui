import Ember from 'ember';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';

export default Ember.Route.extend(AuthenticatedRoute, {
  people: Ember.inject.service(),

  model() {
    return this.get('people.all');
  }
});
