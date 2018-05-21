import {
  clickable,
  collection,
  create,
  isVisible,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/debts'),

  people: collection('tbody', {
    name: text('.name'),
    foodExpenses: text('.person .food-expenses'),
    carExpenses: text('.person .car-expenses'),
    totalExpenses: text('.person .total-expenses'),

    reimburse: clickable('.person .reimburse'),

    rides: collection('tr.ride', {
      date: text('.date'),
      foodExpenses: text('.food-expenses'),
      carExpenses: text('.car-expenses'),
      carExpenseIsDonation: isVisible('md-icon[md-font-icon="card giftcard"]')
    }),

    // TODO this should be nested but table rows 😢
    reimbursements: collection('tr.reimbursement', {
      foodExpenses: text('.food-expenses'),
      carExpenses: text('.car-expenses')
    })
  })
});
