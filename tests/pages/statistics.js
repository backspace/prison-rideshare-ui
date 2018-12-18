import { collection, create, visitable } from 'ember-cli-page-object';

export default create({
  testContainer: 'html',

  visit: visitable('/statistics'),

  start: { scope: '.start input' },
  end: { scope: '.end input' },

  pastYear: { scope: '.past-year' },
  pastTwoWeeks: { scope: '.past-two-weeks' },
  thisYear: { scope: '.this-year' },

  times: {
    scope: 'table',

    days: collection('tr', {
      hours: collection('td.hour'),
    }),
  },
});
