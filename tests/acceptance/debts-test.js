/* eslint-disable qunit/require-expect */
import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers/application-tests';
import { percySnapshot } from 'ember-percy';

import { authenticateSession } from 'ember-simple-auth/test-support';

import page from 'prison-rideshare-ui/tests/pages/debts';
import shared from 'prison-rideshare-ui/tests/pages/shared';

module('Acceptance | debts', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    const sun = this.server.create('person', { name: 'Sun' });
    const kala = this.server.create('person', { name: 'Kala' });
    const will = this.server.create('person', { name: 'Will' });

    const sunRide = this.server.create('ride', {
      driver: sun,
      foodExpenses: 15400,

      carOwner: kala,
      carExpenses: 4400,

      start: new Date(2016, 11, 25, 10, 15),
      end: new Date(2016, 11, 25, 12, 0),
    });

    const secondSunRide = this.server.create('ride', {
      driver: sun,
      foodExpenses: 1000,

      carOwner: sun,
      carExpenses: 0,

      start: new Date(2016, 11, 26, 10, 15),
      end: new Date(2016, 11, 26, 12, 0),
    });

    const willRide = this.server.create('ride', {
      driver: will,
      foodExpenses: 1919,

      carOwner: will,
      carExpenses: 1919,
      donation: true,
    });

    this.server.create('reimbursement', {
      person: sun,
      ride: sunRide,
      foodExpenses: 4400,
    });

    this.server.create('reimbursement', {
      person: kala,
      ride: sunRide,
      carExpenses: 4400,
    });

    // This is not how the server calculates what to return but it’s not worth duplicating the API
    const firstDebt = this.server.create('debt', {
      person: sun,
    });
    // FIXME is this a Mirage bug? This was formerly within the creation but the mock server was returning *both* rides.
    firstDebt.rides = [sunRide, secondSunRide];
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

    assert.equal(shared.title, 'Debts · Prison Rideshare');

    assert.equal(
      page.people.length,
      2,
      'only people with outstanding debts are listed'
    );

    const sun = page.people[0];
    assert.equal(sun.foodExpenses, '120');
    assert.equal(sun.carExpenses, '0');
    assert.equal(sun.totalExpenses, '120');

    assert.equal(sun.rides.length, '2');

    const recentSunRide = sun.rides[0];
    assert.equal(recentSunRide.date, 'Mon Dec 26 2016 10:15a — 12p');
    assert.equal(recentSunRide.foodExpenses, '10');

    const sunRide = sun.rides[1];
    assert.equal(sunRide.date, 'Sun Dec 25 2016 10:15a — 12p');
    assert.equal(sunRide.foodExpenses, '154');
    assert.equal(sunRide.carExpenses, '');

    assert.equal(
      sun.reimbursements.length,
      '1',
      'expected the Kala reimbursement to be hidden'
    );
    assert.equal(sun.reimbursements[0].foodExpenses, '-44');
    assert.equal(sun.reimbursements[0].carExpenses, '');

    const will = page.people[1];
    assert.equal(will.foodExpenses, '19.19');
    assert.equal(will.carExpenses, '19.19');
    assert.equal(will.totalExpenses, '38.38');
    assert.equal(will.rides.length, '1');
    assert.ok(
      will.rides[0].carExpenseIsDonation,
      'expected the ride’s car expenses to be marked a donation'
    );
  });

  test('a debt can be reimbursed', async function (assert) {
    await page.visit();
    await page.people[0].reimburse();

    assert.equal(
      page.people.length,
      1,
      'expected the debt to have disappeared'
    );
    assert.equal(
      this.server.db.debts.length,
      1,
      'expected the debt to have been deleted on the server'
    );
  });
});
