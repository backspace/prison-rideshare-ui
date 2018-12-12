import {
  clickable,
  collection,
  create,
  is,
  text,
  visitable,
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/reports/new'),

  rides: collection('md-radio-button', {
    label: text('.md-label > span'),
    choose: clickable(),
  }),

  noRides: { scope: '.no-rides' },

  distance: { scope: '.distance input' },
  carExpenses: { scope: '.car-expenses input' },
  foodExpenses: { scope: '.food-expenses input' },
  notes: { scope: '.report-notes textarea' },
  donation: {
    scope: 'md-checkbox',
  },

  submitButton: {
    scope: 'button.submit',
    disabled: is('[disabled]'),
    click: clickable(),
  },
});
