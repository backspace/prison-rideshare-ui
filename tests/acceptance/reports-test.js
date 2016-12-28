import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import page from 'prison-rideshare-ui/tests/pages/report';

moduleForAcceptance('Acceptance | reports');

test('submit a report for a ride', function(assert) {
  const leavenworth = server.create('institution', {
    name: 'Fort Leavenworth'
  });

  const remand = server.create('institution', {
    name: 'Remand Centre'
  });

  server.create('ride', {
    name: 'Chelsea',
    start: new Date(2016, 11, 25, 10, 15),
    end: new Date(2016, 11, 25, 12, 0),
    passengers: 1,
    institution: remand
  });

  server.create('ride', {
    name: 'Edward',
    start: new Date(2016, 11, 27, 17, 0),
    end: new Date(2016, 11, 27, 19, 0),
    passengers: 1,
    institution: leavenworth
  });

  page.visit();

  andThen(function() {
    assert.equal(page.rides().count, 2, 'expected two rides to choose from');

    assert.equal(page.rides(0).label, 'Sun, Dec 25 at 10:15am to Remand Centre');
    assert.equal(page.rides(1).label, 'Tue, Dec 27 at 5:00pm to Fort Leavenworth');
  });

  page.rides(0).choose();

  page.fillDistance(75);
  page.fillFoodExpenses(25.50);
  page.fillNotes('These r the notes');

  page.submit();

  andThen(function() {
    const firstRide = server.db.rides[0];

    assert.equal(firstRide.distance, 75);
    assert.equal(firstRide.foodExpenses, 25.50);
    assert.equal(firstRide.reportNotes, 'These r the notes');

    assert.equal(currentURL(), '/');
  });
});
