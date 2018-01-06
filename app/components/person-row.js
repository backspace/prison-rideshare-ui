import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
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
});
