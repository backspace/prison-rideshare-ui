import Ember from 'ember';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';

export default Ember.Route.extend(AuthenticatedRoute, {
  session: Ember.inject.service(),

  beforeModel() {
    if (this.get('session.isAuthenticated')) {
      this.transitionTo('rides');
    } else {
      this.transitionTo('reports.new');
    }
  }
});
