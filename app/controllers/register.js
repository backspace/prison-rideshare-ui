import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service(),

  actions: {
    register(event) {
      event.preventDefault();

      const user = this.get('model');
      user.save();
    }
  }
});
