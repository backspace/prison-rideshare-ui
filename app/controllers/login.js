import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service(),

  sandbox: Ember.computed(function() {
    return window.location.hostname.indexOf('sandbox') > -1;
  }),

  actions: {
    login(event) {
      event.preventDefault();

      const user = this.get('model');

      this.get('session').authenticate(
        'authenticator:application',
        user.get('email'),
        user.get('password')
      );
    }
  }
});
