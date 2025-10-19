import { collection, create, visitable } from 'ember-cli-page-object';

export default create({
  visit: visitable('/statistics'),

  start: { scope: '[data-test-statistics-start]' },

  end: { scope: '[data-test-statistics-end]' },

  pastYear: { scope: '[data-test-statistics-past-year]' },
  pastTwoWeeks: { scope: '[data-test-statistics-past-two-weeks]' },
  thisYear: { scope: '[data-test-statistics-this-year]' },

  times: {
    scope: 'table',

    days: collection('tr', {
      hours: collection('td.hour'),
    }),
  },
});
