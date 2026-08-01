import { collection, create, property, visitable } from 'ember-cli-page-object';

export default create({
  visit: visitable('/reports/new'),

  rides: collection('[data-test-report-ride-option]'),

  noRides: { scope: '[data-test-report-no-rides]' },
  noSession: { scope: '[data-test-report-no-session]' },

  distance: { scope: '[data-test-report-distance]' },
  distanceError: { scope: '[data-test-report-distance-error]' },

  carExpenses: { scope: '[data-test-report-car-expenses]' },
  carExpensesError: { scope: '[data-test-report-car-expenses-error]' },

  foodExpenses: { scope: '[data-test-report-food-expenses]' },
  foodExpensesError: { scope: '[data-test-report-food-expenses-error]' },

  notes: { scope: '[data-test-report-notes]' },
  notesError: { scope: '[data-test-report-notes-error]' },

  donation: {
    scope: '[data-test-report-donation]',
    isChecked: property('checked', 'input'),
  },
  donationError: { scope: '[data-test-report-donation-error]' },

  submitButton: {
    scope: '[data-test-report-submit]',
    disabled: property('disabled'),
  },
});
