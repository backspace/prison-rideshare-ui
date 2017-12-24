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
  month: text('something'),

  days: collection({
    itemScope: '.ember-power-calendar-day',

    item: {
      slots: collection({
        itemScope: '.slot',

        item: {
          hours: text('.hours'),
          count: text('.count'),

          isCommittedTo: hasClass('is-committed-to')
        }
      })
    }
  }),

  error: text('.error')
});
