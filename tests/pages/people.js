import {
  clickable,
  collection,
  create,
  fillable,
  text,
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
      },

      edit: clickable('button.edit')
    },

    head: {
      scope: 'thead',
      clickName: clickable('.name'),
      clickOwed: clickable('.owed')
    }
  }),

  form: {
    nameField: {
      scope: '.name input',
      fill: fillable()
    },

    submit: clickable('button.submit'),
    cancel: clickable('button.cancel')
  }
});
