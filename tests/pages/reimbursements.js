import {
  attribute,
  clickable,
  collection,
  create,
  isVisible,
  property,
  text,
  visitable,
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/reimbursements'),

  rows: collection('[data-test-reimbursement-row]', {
    rowType: attribute('data-row-type'),
    month: text('[data-test-reimbursement-month]'),

    name: text('[data-test-reimbursement-name]'),
    foodExpenses: text('[data-test-reimbursement-food]'),
    carExpenses: text('[data-test-reimbursement-car-value]'),
    carExpenseIsDonation: isVisible('[data-test-reimbursement-donation]'),
    totalExpenses: text('[data-test-reimbursement-total]'),

    processButton: {
      scope: '[data-test-reimbursement-process]',
      variant: attribute('data-variant'),
    },

    donateButton: {
      scope: '[data-test-reimbursement-donate]',
      variant: attribute('data-variant'),
    },

    copyButton: {
      scope: '[data-test-reimbursement-copy]',
      clipboardText: attribute('data-test-clipboard-text'),
    },
  }),

  reimbursements: collection('[data-test-processed-row]', {
    date: text('[data-test-processed-date]'),
    name: text('[data-test-processed-name]'),
    ride: text('[data-test-processed-ride]'),

    expenses: text('[data-test-processed-expense-value]'),
    expenseIcon: attribute(
      'data-test-processed-expense-icon',
      '[data-test-processed-expense-icon]',
    ),

    isFoodExpense() {
      return this.expenseIcon === 'food';
    },

    isCarExpense() {
      return this.expenseIcon === 'car';
    },

    isDonation: isVisible('[data-test-processed-donation-icon]'),
  }),

  processedSwitch: {
    scope: '[data-test-reimbursements-processed-toggle]',
    enabled: property('checked'),
  },

  form: {
    scope: '[data-test-reimbursement-modal]',

    amountField: {
      scope: '[data-test-reimbursement-amount]',
    },

    donationCheckbox: {
      scope: '[data-test-reimbursement-donation]',
      checked: property('checked', 'input'),
    },

    submit: clickable('[data-test-reimbursement-save]'),
    cancel: clickable('[data-test-reimbursement-cancel]'),
  },

  noReimbursementsMessage: {
    scope: '[data-test-no-reimbursements]',
  },
});
