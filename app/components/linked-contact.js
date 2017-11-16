import Ember from "ember";
import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  linkedContact: computed('contact', function() {
    const phonePattern = /(\([0-9]{3}\)\s?|[0-9]{3}-?\s?)[0-9]{3}-?\s?[0-9]{4}/g;
    const contact = this.get('contact');

    if (contact) {
      return htmlSafe(contact.replace(phonePattern, function(number) {
        const escapedNumber = Ember.Handlebars.Utils.escapeExpression(number);
        return `<a href='tel:${escapedNumber}'>${escapedNumber}</a>`;
      }));
    }
  })
});
