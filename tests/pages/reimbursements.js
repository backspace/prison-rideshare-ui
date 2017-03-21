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

  people: collection({
    itemScope: 'tbody tr.person',

    item: {
      name: text('.name'),
      foodExpenses: text('.food-expenses'),
      carExpenses: text('.car-expenses'),
      totalExpenses: text('.total-expenses'),

      process: clickable('.process'),
      donate: clickable('.donate')
    }
  }),

  reimbursements: collection({
    itemScope: 'tbody tr.reimbursement',

    item: {
      name: text('.name'),
      amount: text('.amount'),

      donation: isVisible('.donation .paper-icon'),

      edit: clickable('button')
    }
  }),

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
  }
});
