import Component from '@ember/component';

export default Component.extend({
  classNames: ['person-badge'],

  showContact: false,

  actions: {
    toggleContact() {
      this.toggleProperty('showContact');
    },
  },
});
