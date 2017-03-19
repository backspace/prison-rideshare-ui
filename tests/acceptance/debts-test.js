import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import page from 'prison-rideshare-ui/tests/pages/debts';

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

    const willRide = server.create('ride', {
      driver: will,
      foodExpenses: 1919,

      carOwner: will,
      carExpenses: 1919
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
    firstDebt.rides = [sunRide];

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
    assert.equal(page.people().count, 2, 'only people with outstanding debts are listed');

    const sun = page.people(0);
    assert.equal(sun.foodExpenses, '110');
    assert.equal(sun.carExpenses, '0');
    assert.equal(sun.totalExpenses, '110');

    assert.equal(sun.rides().count, '1');

    const sunRide = sun.rides(0);
    assert.equal(sunRide.date, 'Sun Dec 25 10:15am — 12:00');
    assert.equal(sunRide.foodExpenses, '154');
    assert.equal(sunRide.carExpenses, '0');

    const will = page.people(1);
    assert.equal(will.foodExpenses, '19.19');
    assert.equal(will.carExpenses, '19.19');
    assert.equal(will.totalExpenses, '38.38');
    assert.equal(will.rides().count, '1');
  });
});
