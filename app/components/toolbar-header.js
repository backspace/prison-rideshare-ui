import Ember from 'ember';

export default Ember.Component.extend({
  sidebar: Ember.inject.service(),
  sidebarOpen: Ember.computed.alias('sidebar.open'),

  chips: Ember.computed(function() {
    const hostname = window.location.hostname;

    if (hostname.indexOf('sandbox') > -1) {
      return [{
        label: 'Sandbox',
        title: 'All data on this instance is erased daily. If some type of example data would be useful for you, let Buck know.'
      }];
    } else {
      return [];
    }
  }),

  actions: {
    toggleSidebar() {
      this.toggleProperty('sidebarOpen');
    }
  }
});
