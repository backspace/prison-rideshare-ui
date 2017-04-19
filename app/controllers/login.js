import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service(),

  actions: {
    login(event) {
      event.preventDefault();

      const user = this.get('model');

      this.get('session').authenticate(
        'authenticator:application',
        user.get('email'),
        user.get('password')
      ).catch(error => {
        this.set('error', error);
      })
    }
  }
});
