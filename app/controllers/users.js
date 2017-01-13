import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    updateUserAdmin(user, admin) {
      user.set('admin', admin);
      user.save();
    }
  }
});
