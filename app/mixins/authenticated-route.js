import Ember from 'ember';

export default Ember.Mixin.create({
  session: Ember.inject.service(),

  beforeModel() {
    if (!this.get('session.isAuthenticated')) {
      this.transitionTo('login');
    }
  }
});
