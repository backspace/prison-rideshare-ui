import {
  clickable,
  collection,
  create,
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
      }
    }
  })
});
