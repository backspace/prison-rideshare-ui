import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import { computed } from '@ember/object';
import Ember from 'ember';
import Component from '@ember/component';
import { htmlSafe } from '@ember/string';

@classic
@tagName('span')
export default class LinkedContact extends Component {
  @computed('contact')
  get link() {
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
  }
}
