import {
  clickable,
  collection,
  create,
  property,
  text,
  visitable,
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/reports/new'),

  rides: collection('[data-test-report-ride-option]'),

  noRides: { scope: '[data-test-report-no-rides]' },
  noSession: { scope: '[data-test-report-no-session]' },

  distance: { scope: '[data-test-report-distance]' },

  carExpenses: { scope: '[data-test-report-car-expenses]' },

  foodExpenses: { scope: '[data-test-report-food-expenses]' },

  notes: { scope: '[data-test-report-notes]' },

  donation: {
    scope: '[data-test-report-donation]',
    isChecked: property('checked', 'input'),
  },

  submitButton: {
    scope: '[data-test-report-submit]',
    disabled: property('disabled'),
  },
});
