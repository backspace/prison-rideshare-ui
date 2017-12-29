import {
  collection,
  create,
  hasClass,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/calendar'),

  personSession: text('.person-session'),
  month: text('.ember-power-calendar-nav-title'),

  days: collection({
    itemScope: '.ember-power-calendar-day',

    item: {
      slots: collection({
        itemScope: '.slot',

        item: {
          hours: text('.hours'),

          isCommittedTo: hasClass('is-committed-to'),
          isFull: hasClass('is-full')
        }
      })
    }
  }),

  error: text('.error')
});
