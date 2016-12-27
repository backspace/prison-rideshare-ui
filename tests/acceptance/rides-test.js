import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | rides');

test('list existing rides', function(assert) {
  server.create('ride', {
    name: 'Edward'
  });

  visit('/rides');

  andThen(function() {
    assert.equal(currentURL(), '/rides');

    assert.equal(find('.name').text(), 'Edward');

    assert.equal(find('.date').text(), '2016-12-26');
    assert.equal(find('.times').text(), '8:30pm — 10:00pm');
  });
});

test('create a ride', function(assert) {
  visit('/rides/new');

  fillIn('input.date', '2016-12-26');
  fillIn('input.start', '09:00');
  fillIn('input.end', '11:30');

  fillIn('input.name', 'Edward');

  click('.submit');

  andThen(function() {
    assert.equal(find('.name').text(), 'Edward');

    assert.equal(find('.date').text(), '2016-12-26');
    assert.equal(find('.times').text(), '9:00am — 11:30am');

    const serverRides = server.db.rides;
    const lastRide = serverRides[serverRides.length - 1];

    assert.equal(lastRide.name, 'Edward');
    assert.equal(lastRide.start, '2016-12-26T14:00:00.000Z');
    assert.equal(lastRide.end, '2016-12-26T16:30:00.000Z');

    assert.equal(currentURL(), '/rides');
  });
});
