import Ember from 'ember';

export default Ember.Controller.extend({
  sidebar: Ember.inject.service(),
  session: Ember.inject.service(),
  userSocket: Ember.inject.service(),

  userCount: Ember.computed('userSocket.present.length', function() {
    const count = this.get('userSocket.present.length');

    if (count > 1) {
      return count;
    } else {
      return undefined;
    }
  }),

  actions: {
    logout() {
      this.get('session').invalidate();
      this.store.unloadAll();
    }
  }
});
