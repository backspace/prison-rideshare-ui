/* eslint-disable ember/no-actions-hash, ember/no-classic-classes, ember/no-classic-components, ember/require-tagless-components */
import Component from '@ember/component';

export default Component.extend({
  classNames: ['person-badge'],

  showContact: false,

  actions: {
    toggleContact() {
      if (!this.isDestroying && !this.isDestroyed) {
        this.toggleProperty('showContact');
      }
    },
  },
});
