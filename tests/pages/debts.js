import {
  attribute,
  clickable,
  collection,
  create,
  text,
  visitable,
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/debts'),

  people: collection('[data-test-debt-person-row]', {
    id: attribute(['data-test-person-id']),
    name: text('[data-test-debt-person-name]'),
    foodExpenses: text('[data-test-debt-person-food]'),
    carExpenses: text('[data-test-debt-person-car]'),
    totalExpenses: text('[data-test-debt-person-total]'),

    reimburse: clickable('[data-test-debt-reimburse]'),
  }),
});
