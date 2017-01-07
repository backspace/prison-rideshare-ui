import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service(),

  actions: {
    register() {
      const user = this.get('model');

      user.save();
    }
  }
});
