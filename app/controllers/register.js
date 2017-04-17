import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service(),

  actions: {
    register(event) {
      event.preventDefault();

      const user = this.get('model');
      
      return user.save().then(() => {
        return this.get('session').authenticate(
          'authenticator:application',
          user.get('email'),
          user.get('password')
        );
      });
    }
  }
});
