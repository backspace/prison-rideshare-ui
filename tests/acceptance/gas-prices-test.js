import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers/application-tests';

import page from 'prison-rideshare-ui/tests/pages/gas-prices';
import shared from 'prison-rideshare-ui/tests/pages/shared';

module('Acceptance | reports', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.server.create('gas-price', {
      price: 100,
      closeRate: 96,
      farRate: 69,
      insertedAt: new Date(2018, 6, 6, 14),
    });

    this.server.create('gas-price', {
      price: 101,
      closeRate: 84,
      farRate: 48,
      insertedAt: new Date(2018, 6, 7, 14),
    });

    this.server.create('gas-price', { insertedAt: new Date(2018, 6, 1, 14) });
    this.server.create('gas-price', { insertedAt: new Date(2018, 6, 1, 14) });
    this.server.create('gas-price', { insertedAt: new Date(2018, 6, 1, 14) });
    this.server.create('gas-price', { insertedAt: new Date(2018, 6, 1, 14) });
    this.server.create('gas-price', { insertedAt: new Date(2018, 6, 1, 14) });
    this.server.create('gas-price', { insertedAt: new Date(2018, 6, 1, 14) });
    this.server.create('gas-price', { insertedAt: new Date(2018, 6, 1, 14) });
    this.server.create('gas-price', { insertedAt: new Date(2018, 6, 1, 14) });
    this.server.create('gas-price', { insertedAt: new Date(2018, 6, 1, 14) });
    this.server.create('gas-price', { insertedAt: new Date(2018, 6, 1, 14) });
  });

  test('it lists gas prices and reïmbursement rates', async function(assert) {
    await page.visit();

    assert.equal(shared.title, 'Gas prices · Prison Rideshare');

    assert.equal(
      page.gasPrices.length,
      10,
      'expected ten gas prices to be listed'
    );

    page.gasPrices[0].as(latest => {
      assert.equal(latest.date, 'Sat, Jul 7');
      assert.equal(latest.price, '101¢⁄L');
      assert.equal(latest.closeRate, '84¢⁄km');
      assert.equal(latest.farRate, '48¢⁄km');
    });

    assert.equal(page.gasPrices[1].date, 'Fri, Jul 6');
  });
});
