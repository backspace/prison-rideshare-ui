import {
  attribute,
  collection,
  create,
  hasClass,
  text,
  visitable
} from 'ember-cli-page-object';
import { getter } from 'ember-cli-page-object/macros';

export default create({
  visit: visitable('/calendar/:month'),

  personSession: text('.person-session'),
  month: text('.ember-power-calendar-nav-title'),

  days: collection({
    itemScope: '.ember-power-calendar-day',

    item: {
      slots: collection({
        itemScope: '.slot md-checkbox',

        item: {
          hours: text('.hours'),

          isCommittedTo: hasClass('md-checked'),
          disabledAttribute: attribute('disabled'),
          isFull: getter(function() {
            return this.disabledAttribute === 'disabled';
          })
        }
      })
    }
  }),

  error: text('.error')
});
