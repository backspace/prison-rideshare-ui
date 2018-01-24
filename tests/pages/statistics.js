import {
  collection,
  create,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/statistics'),

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
