import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import page from 'prison-rideshare-ui/tests/pages/rides';

moduleForAcceptance('Acceptance | rides');

test('list existing rides with sortability', function(assert) {
  server.create('ride', {
    name: 'Edward'
  });

  server.create('ride', {
    name: 'Chelsea',
    start: new Date(2016, 11, 25, 10, 15),
    end: new Date(2016, 11, 25, 12, 0)
  });

  page.visit();

  andThen(function() {
    const ride = page.rides(0);

    assert.equal(ride.name, 'Edward');

    assert.equal(ride.date, '2016-12-26');
    assert.equal(ride.times, '8:30pm — 10:00pm');

    assert.equal(page.rides(1).name, 'Chelsea', 'expected the earlier ride to be sorted to the bottom');
  });

  page.rides().head.clickDate();

  andThen(function() {
    assert.equal(page.rides(0).name, 'Chelsea', 'expected the earlier ride to be sorted to the top');
  });
});

test('create a ride', function(assert) {
  page.visit();
  page.newRide();

  page.form.fillDate('2016-12-26');
  page.form.fillStart('09:00');
  page.form.fillEnd('11:30');

  page.form.fillName('Edward');

  click('.submit');

  andThen(function() {
    const ride = page.rides(0);
    assert.equal(ride.name, 'Edward');

    assert.equal(ride.date, '2016-12-26');
    assert.equal(ride.times, '9:00am — 11:30am');

    const serverRides = server.db.rides;
    const lastRide = serverRides[serverRides.length - 1];

    assert.equal(lastRide.name, 'Edward');
    assert.equal(lastRide.start, '2016-12-26T14:00:00.000Z');
    assert.equal(lastRide.end, '2016-12-26T16:30:00.000Z');

    assert.equal(currentURL(), '/rides');
  });
});
