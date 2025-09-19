/* eslint-disable ember/no-classic-classes, ember/no-classic-components, ember/require-return-from-computed, ember/require-tagless-components */
import Ember from 'ember';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  tagName: 'span',

  link: computed('contact', function () {
    const phonePattern =
      /(\([0-9]{3}\)\s?|[0-9]{3}-?\s?)[0-9]{3}-?\s?[0-9]{4}/g;
    const contact = this.contact;

    if (contact) {
      return htmlSafe(
        contact.replace(phonePattern, function (number) {
          const escapedNumber = Ember.Handlebars.Utils.escapeExpression(number);
          return `<a href='tel:${escapedNumber}'>${escapedNumber}</a>`;
        })
      );
    }
  }),
});
