import {
  collection,
  create,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/debts'),

  people: collection({
    itemScope: 'tbody',

    item: {
      name: text('.name'),
      foodExpenses: text('.person .food-expenses'),
      carExpenses: text('.person .car-expenses'),
      totalExpenses: text('.person .total-expenses'),

      rides: collection({
        itemScope: 'tr.ride',

        item: {
          date: text('.date'),
          foodExpenses: text('.food-expenses'),
          carExpenses: text('.car-expenses'),
        }
      }),

      // TODO this should be nested but table rows 😢
      reimbursements: collection({
        itemScope: 'tr.reimbursement',

        item: {
          foodExpenses: text('.food-expenses'),
          carExpenses: text('.car-expenses')
        }
      })
    }
  })
});
