import Ember from 'ember';

export default Ember.Component.extend({
  sidebar: Ember.inject.service(),
  sidebarOpen: Ember.computed.alias('sidebar.open'),

  actions: {
    toggleSidebar() {
      this.toggleProperty('sidebarOpen');
    }
  }
});
