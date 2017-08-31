import {
  clickable,
  collection,
  create,
  is,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/reports/new'),

  rides: collection({
    itemScope: 'md-radio-button',

    item: {
      label: text('.md-label span'),
      choose: clickable()
    }
  }),

  distance: { scope: '.distance input' },
  foodExpenses: { scope: '.food-expenses input' },
  notes: { scope: '.report-notes textarea' },

  submitButton: {
    scope: 'button.submit',
    disabled: is('[disabled]'),
    click: clickable()
  }
});
