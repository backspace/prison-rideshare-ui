import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import page from 'prison-rideshare-ui/tests/pages/report';
import shared from 'prison-rideshare-ui/tests/pages/shared';

moduleForAcceptance('Acceptance | reports', {
  beforeEach() {
    const leavenworth = server.create('institution', {
      name: 'Fort Leavenworth'
    });

    const remand = server.create('institution', {
      name: 'Remand Centre'
    });

    const edwardRide = server.create('ride', {
      name: 'Edward',
      start: new Date(2016, 11, 27, 17, 0),
      end: new Date(2016, 11, 27, 19, 0),
      passengers: 1,
      institution: leavenworth
    });

    server.create('ride', {
      name: 'Chelsea',
      start: new Date(2016, 11, 25, 10, 15),
      end: new Date(2016, 11, 25, 12, 0),
      passengers: 1,
      institution: remand,
      initials: 'francine'
    });

    server.create('ride', { enabled: false });

    server.create('ride', {
      name: 'Assata',
      distance: 100
    });

    server.create('ride', { combinedWith: edwardRide });

    // This ride should not display because it’s in the future.
    server.create('ride', {
      name: 'Future',
      start: new Date(new Date().getTime() + 1000*60*60*24),
      end: new Date(new Date().getTime() + 1000*60*60*24 + 1000)
    });

    // FIXME this should not be required
    authenticateSession(this.application);
  }
});

test('submit a report for a ride', function(assert) {
  page.visit();

  andThen(function() {
    assert.equal(shared.title, 'Ride report · Prison Rideshare');

    assert.equal(page.rides().count, 2, 'expected two rides to choose from');

    assert.equal(page.rides(0).label, 'francine: Sun, Dec 25 at 10:15am to Remand Centre');
    assert.equal(page.rides(1).label, 'Tue, Dec 27 at 5:00pm to Fort Leavenworth');

    assert.ok(page.submitButton.disabled, 'expected the form to not yet be valid');
  });

  page.distance.fillIn(75);

  andThen(() => assert.ok(page.submitButton.disabled, 'expected the form to still not be valid'));

  page.rides(0).choose();

  andThen(() => assert.notOk(page.submitButton.disabled, 'expected the form to be valid'));

  page.foodExpenses.fillIn(25.50);
  page.notes.fillIn('These r the notes');

  page.submitButton.click();

  andThen(function() {
    const changedRide = server.db.rides[1];

    assert.equal(changedRide.distance, 75);
    assert.equal(changedRide.foodExpenses, 2550);
    assert.equal(changedRide.reportNotes, 'These r the notes');

    assert.equal(currentURL(), '/rides');
  });
});

test('partially completing a report and changing the ride doesn’t erase the values', function(assert) {
  const longReport = 'This is a very long report I would be sad to lose.';

  page.visit();

  page.notes.fillIn(longReport);

  page.rides(0).choose();

  andThen(() => {
    assert.equal(page.notes.value, longReport);
  });

  page.rides(1).choose();

  andThen(() => {
    assert.equal(page.notes.value, longReport);
  });
});
