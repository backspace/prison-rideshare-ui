import {
  collection,
  create,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/statistics'),

  start: { scope: '.start input' },
  end: { scope: '.end input' },

  times: {
    scope: 'table',

    days: collection({
      itemScope: 'tr',

      item: {
        hours: collection({
          itemScope: 'td.hour'
        })
      }
    })
  }
});
