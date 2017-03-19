import {
  collection,
  create,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/debts'),

  people: collection({
    itemScope: 'tbody tr.debt',

    item: {
      name: text('.name'),
      foodExpenses: text('.food-expenses'),
      carExpenses: text('.car-expenses'),
      totalExpenses: text('.total-expenses')
    }
  })
});
