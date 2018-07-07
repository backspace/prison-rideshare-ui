import {
  collection,
  create,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/gas-prices'),

  gasPrices: collection('.gas-prices tbody tr', {
    date: text('.date'),
    price: text('.price'),
    farRate: text('.far'),
    closeRate: text('.close')
  }),
});
