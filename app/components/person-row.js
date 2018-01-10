import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  toasts: service(),

  tagName: '',

  emailClass: computed('person.medium', function() {
    return `email ${this.get('person.medium') === 'email' ? 'is-preferred' : ''}`;
  }),

  mobileClass: computed('person.medium', function() {
    return `mobile ${this.get('person.medium') === 'mobile' ? 'is-preferred' : ''}`;
  }),

  landlineClass: computed('person.medium', function() {
    return `landline ${this.get('person.medium') === 'landline' ? 'is-preferred' : ''}`;
  }),

  actions: {
    toggleActiveness(active) {
      this.set('person.active', active);
      this.get('person').save().catch(() => {
        this.get('toasts').show(`There was an error saving the active status of ${this.get('person.name')}`);
      });
    }
  }
});
