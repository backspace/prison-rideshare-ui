import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import page from 'prison-rideshare-ui/tests/pages/debts';
import shared from 'prison-rideshare-ui/tests/pages/shared';

moduleForAcceptance('Acceptance | debts', {
  beforeEach() {
    const sun = server.create('person', {name: 'Sun'});
    const kala = server.create('person', {name: 'Kala'});
    const will = server.create('person', {name: 'Will'});

    const sunRide = server.create('ride', {
      driver: sun,
      foodExpenses: 15400,

      carOwner: kala,
      carExpenses: 4400,

      start: new Date(2016, 11, 25, 10, 15),
      end: new Date(2016, 11, 25, 12, 0)
    });

    const secondSunRide = server.create('ride', {
      driver: sun,
      foodExpenses: 1000,

      carOwner: sun,
      carExpenses: 0,

      start: new Date(2016, 11, 26, 10, 15),
      end: new Date(2016, 11, 25, 12, 0)
    });

    const willRide = server.create('ride', {
      driver: will,
      foodExpenses: 1919,

      carOwner: will,
      carExpenses: 1919,
      donation: true
    });

    server.create('reimbursement', {
      person: sun,
      ride: sunRide,
      foodExpenses: 4400
    });

    server.create('reimbursement', {
      person: kala,
      ride: sunRide,
      carExpenses: 4400
    });

    // This is not how the server calculates what to return but it’s not worth duplicating the API
    const firstDebt = server.create('debt', {
      person: sun
    });
    // FIXME is this a Mirage bug? This was formerly within the creation but the mock server was returning *both* rides.
    firstDebt.rides = [sunRide, secondSunRide];

    const secondDebt = server.create('debt', {
      person: will
    });
    secondDebt.rides = [willRide];

    authenticateSession(this.application);
  }
});

test('debts are listed', function(assert) {
  page.visit();

  andThen(() => {
    assert.equal(shared.title, 'Debts · Prison Rideshare');

    assert.equal(page.people().count, 2, 'only people with outstanding debts are listed');

    const sun = page.people(0);
    assert.equal(sun.foodExpenses, '120');
    assert.equal(sun.carExpenses, '0');
    assert.equal(sun.totalExpenses, '120');

    assert.equal(sun.rides().count, '2');

    const recentSunRide = sun.rides(0);
    assert.equal(recentSunRide.date, 'Mon Dec 26 10:15am — 12:00');
    assert.equal(recentSunRide.foodExpenses, '10');

    const sunRide = sun.rides(1);
    assert.equal(sunRide.date, 'Sun Dec 25 10:15am — 12:00');
    assert.equal(sunRide.foodExpenses, '154');
    assert.equal(sunRide.carExpenses, '');

    assert.equal(sun.reimbursements().count, '1', 'expected the Kala reimbursement to be hidden');
    assert.equal(sun.reimbursements(0).foodExpenses, '-44');
    assert.equal(sun.reimbursements(0).carExpenses, '');

    const will = page.people(1);
    assert.equal(will.foodExpenses, '19.19');
    assert.equal(will.carExpenses, '19.19');
    assert.equal(will.totalExpenses, '38.38');
    assert.equal(will.rides().count, '1');
    assert.ok(will.rides(0).carExpenseIsDonation, 'expected the ride’s car expenses to be marked a donation');
  });
});

test('a debt can be reimbursed', function(assert) {
  page.visit();
  page.people(0).reimburse();

  andThen(() => {
    assert.equal(page.people().count, 1, 'expected the debt to have disappeared');
    assert.equal(server.db.debts.length, 1, 'expected the debt to have been deleted on the server');
  });
});
