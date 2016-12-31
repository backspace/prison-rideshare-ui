import {
  clickable,
  collection,
  create,
  fillable,
  text,
  value,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/people'),

  people: collection({
    itemScope: 'tbody tr.person',

    item: {
      name: text('.name'),
      foodExpenses: text('.food'),
      carExpenses: text('.car'),
      reimbursements: text('.reimbursements'),
      owed: text('.owed'),

      reimburseButton: {
        scope: 'button.reimburse',
        click: clickable()
      }
    }
  }),

  reimbursementForm: {
    amountField: {
      scope: '.amount input',
      value: value(),
      fill: fillable()
    },

    submit: clickable('button.submit'),
    cancel: clickable('button.cancel')
  }

});
