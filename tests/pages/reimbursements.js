import {
  clickable,
  collection,
  create,
  fillable,
  isVisible,
  text,
  value,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/reimbursements'),

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

    submit: clickable('button.submit'),
    cancel: clickable('button.cancel')
  }
});
