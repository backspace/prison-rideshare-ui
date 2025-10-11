/* eslint-disable qunit/require-expect */
import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers/application-tests';
import { percySnapshot } from 'ember-percy';

import { authenticateSession } from 'ember-simple-auth/test-support';

import page from 'prison-rideshare-ui/tests/pages/debts';
import { getPageTitle } from 'ember-page-title/test-support';

module('Acceptance | debts', function (hooks) {
  setupApplicationTest(hooks);

  let sun, firstSunRide, secondSunRide, will, willRide;

  hooks.beforeEach(async function () {
    sun = this.server.create('person', { name: 'Sun' });
    const kala = this.server.create('person', { name: 'Kala' });
    will = this.server.create('person', { name: 'Will' });

    firstSunRide = this.server.create('ride', {
      driver: sun,
      foodExpenses: 15400,

      carOwner: kala,
      carExpenses: 4400,

      start: new Date(2016, 11, 25, 10, 15),
      end: new Date(2016, 11, 25, 12, 0),
    });

    secondSunRide = this.server.create('ride', {
      driver: sun,
      foodExpenses: 1000,

      carOwner: sun,
      carExpenses: 0,

      start: new Date(2016, 11, 26, 10, 15),
      end: new Date(2016, 11, 26, 12, 0),
    });

    willRide = this.server.create('ride', {
      driver: will,
      foodExpenses: 1919,

      carOwner: will,
      carExpenses: 1919,
      donation: true,
    });

    this.server.create('reimbursement', {
      person: sun,
      ride: firstSunRide,
      foodExpenses: 4400,
    });

    this.server.create('reimbursement', {
      person: kala,
      ride: firstSunRide,
      carExpenses: 4400,
    });

    // This is not how the server calculates what to return but it’s not worth duplicating the API
    const firstDebt = this.server.create('debt', {
      person: sun,
    });
    // FIXME is this a Mirage bug? This was formerly within the creation but the mock server was returning *both* rides.
    firstDebt.rides = [firstSunRide, secondSunRide];
    firstDebt.save();

    const secondDebt = this.server.create('debt', {
      person: will,
    });
    secondDebt.rides = [willRide];
    secondDebt.save();

    await authenticateSession(this.application);
  });

  test('debts are listed', async function (assert) {
    await page.visit();

    percySnapshot(assert);

    assert.equal(getPageTitle(), 'Debts · Prison Rideshare');
    assert.equal(
      page.people.length,
      2,
      'only people with outstanding debts are listed',
    );

    const sun = page.people[0];
    assert.equal(sun.foodExpenses, '120');
    assert.equal(sun.carExpenses, '0');
    assert.equal(sun.totalExpenses, '120');

    assert
      .dom(`[data-test-debt-ride-row][data-test-driver-id="${sun.id}"]`)
      .exists({ count: 2 });

    let recentSunRideSelector = `[data-test-debt-ride-row][data-test-ride-id="${secondSunRide.id}"]`;

    assert
      .dom(`${recentSunRideSelector} [data-test-debt-ride-date]`)
      .hasText('Mon Dec 26 2016 10:15a — 12p');
    assert
      .dom(`${recentSunRideSelector} [data-test-debt-ride-food]`)
      .hasText('10');
    assert.dom(`${recentSunRideSelector} [data-test-debt-ride-car]`);

    let olderSunRideSelector = `[data-test-debt-ride-row][data-test-ride-id="${firstSunRide.id}"]`;

    assert
      .dom(`${olderSunRideSelector} [data-test-debt-ride-date]`)
      .hasText('Sun Dec 25 2016 10:15a — 12p');
    assert
      .dom(`${olderSunRideSelector} [data-test-debt-ride-food]`)
      .hasText('154');
    assert.dom(`${olderSunRideSelector} [data-test-debt-ride-car]`).hasText('');
    assert
      .dom(`${olderSunRideSelector} [data-test-debt-ride-food-reimbursed]`)
      .hasText('-44');
    assert
      .dom(`${olderSunRideSelector} [data-test-debt-ride-food-reimbursed]`)
      .hasAttribute('title', '44 has already been reimbursed');

    const will = page.people[1];
    assert.equal(will.foodExpenses, '19.19');
    assert.equal(will.carExpenses, '19.19');
    assert.equal(will.totalExpenses, '38.38');

    assert
      .dom(`[data-test-debt-ride-row][data-test-driver-id="${will.id}"]`)
      .exists({ count: 1 });

    assert
      .dom(
        `[data-test-debt-ride-row][data-test-driver-id="${will.id}"] [data-test-debt-ride-donation]`,
      )
      .exists();
  });

  test('a debt can be reimbursed', async function (assert) {
    await page.visit();
    await page.people[0].reimburse();

    assert.equal(
      page.people.length,
      1,
      'expected the debt to have disappeared',
    );
    assert.equal(
      this.server.db.debts.length,
      1,
      'expected the debt to have been deleted on the server',
    );
  });
});
