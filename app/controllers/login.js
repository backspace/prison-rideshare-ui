import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service(),

  actions: {
    login() {
      const user = this.get('model');

      this.get('session').authenticate(
        'authenticator:application',
        user.get('email'),
        user.get('password')
      );
    }
  }
});
