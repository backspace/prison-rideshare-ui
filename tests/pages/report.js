import {
  collection,
  create,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/reports/new'),

  rides: collection({
    itemScope: 'md-radio-button',

    item: {
      label: text('.md-label span')
    }
  })
});
