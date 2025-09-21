/* eslint-disable ember/no-actions-hash, ember/no-classic-classes, ember/no-classic-components, ember/require-tagless-components */
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  session: service(),
  sidebar: service(),
  sidebarOpen: alias('sidebar.open'),

  chips: computed(function () {
    const hostname = window.location.hostname;

    if (hostname.indexOf('sandbox') > -1) {
      return [
        {
          label: 'Sandbox',
          title:
            'All data on this instance is erased daily. If some type of example data would be useful for you, let Buck know.',
        },
      ];
    } else {
      return [];
    }
  }),

  actions: {
    toggleSidebar() {
      this.toggleProperty('sidebarOpen');
    },
  },
});
