import Ember from 'ember';
import Component from '@glimmer/component';
import { htmlSafe } from '@ember/string';

export default class LinkedContact extends Component {
  <template>
    {{#if @contact}}
      {{this.link}}
    {{/if}}
  </template>

  get link() {
    const phonePattern =
      /(\([0-9]{3}\)\s?|[0-9]{3}-?\s?)[0-9]{3}-?\s?[0-9]{4}/g;
    const contact = this.args.contact;

    if (contact) {
      return htmlSafe(
        contact.replace(phonePattern, function (number) {
          const escapedNumber = Ember.Handlebars.Utils.escapeExpression(number);
          return `<a href='tel:${escapedNumber}'>${escapedNumber}</a>`;
        }),
      );
    }

    return undefined;
  }
}
