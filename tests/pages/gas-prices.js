import { collection, create, text, visitable } from 'ember-cli-page-object';

export default create({
  visit: visitable('/gas-prices'),

  gasPrices: collection('[data-test-gas-prices-row]', {
    date: text('[data-test-gas-prices-date]'),
    price: text('[data-test-gas-prices-price]'),
    farRate: text('[data-test-gas-prices-far-rate]'),
    closeRate: text('[data-test-gas-prices-close-rate]'),
  }),
});
