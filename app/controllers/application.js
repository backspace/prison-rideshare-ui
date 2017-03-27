import Ember from 'ember';

export default Ember.Controller.extend({
  sidebar: Ember.inject.service(),
  session: Ember.inject.service(),

  actions: {
    logout() {
      this.get('session').invalidate();
      this.store.unloadAll();
    }
  }
});
