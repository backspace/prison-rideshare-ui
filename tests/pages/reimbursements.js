import {
  clickable,
  collection,
  create,
  fillable,
  hasClass,
  isVisible,
  text,
  value,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/reimbursements'),

  rows: collection({
    itemScope: 'tbody tr',

    item: {
      month: text('.month'),
  
      name: text('.name'),
      foodExpenses: text('.food-expenses'),
      carExpenses: text('.car-expenses'),
      carExpenseIsDonation: isVisible('md-icon[md-font-icon="card giftcard"]'),
      totalExpenses: text('.total-expenses'),

      processButton: {
        scope: '.process',
        isPrimary: hasClass('md-primary')
      },

      donateButton: {
        scope: '.donate',
        isPrimary: hasClass('md-primary')
      }
    }
  }),

  reimbursements: collection({
    itemScope: 'tbody tr.reimbursement',

    item: {
      date: text('.date'),
      name: text('.name'),
      ride: text('.ride'),

      expenses: text('.expenses span'),
      isFoodExpense: isVisible('.paper-icon[md-font-icon="local cafe"]'),
      isCarExpense: isVisible('.paper-icon[md-font-icon="local gas station"]'),

      isDonation: isVisible('.donation .paper-icon'),

      edit: clickable('button')
    }
  }),

  processedSwitch: {
    scope: '.paper-switch.processed',
    enabled: hasClass('md-checked'),
    click: clickable('.md-thumb')
  },

  form: {
    amountField: {
      scope: '.amount input',
      value: value(),
      fill: fillable()
    },

    donationCheckbox: {
      scope: 'md-checkbox',
      checked: hasClass('md-checked'),
      click: clickable()
    },

    submit: clickable('button.submit'),
    cancel: clickable('button.cancel')
  },

  noReimbursementsMessage: {
    scope: '.no-reimbursements'
  }
});
