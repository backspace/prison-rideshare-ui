import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service(),

  actions: {
    updateUserAdmin(user, admin) {
      user.set('admin', admin);
      user.save();
    }
  }
});
