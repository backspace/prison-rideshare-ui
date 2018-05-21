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
      institution: leavenworth,
      donatable: false
    });

    server.create('ride', {
      name: 'Chelsea',
      start: new Date(2016, 11, 25, 10, 15),
      end: new Date(2016, 11, 25, 12, 0),
      passengers: 1,
      institution: remand,
      initials: 'francine',
      donatable: true
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
  }
});

test('submit a report for a ride', function(assert) {
  authenticateSession(this.application);

  page.visit();

  andThen(function() {
    assert.equal(shared.title, 'Ride report · Prison Rideshare');

    assert.equal(page.rides.length, 2, 'expected two rides to choose from');

    assert.equal(page.rides[0].label, 'francine: Sun, Dec 25 at 10:15a to Remand Centre');
    assert.equal(page.rides[1].label, 'Tue, Dec 27 at 5:00p to Fort Leavenworth');
  });

  page.distance.fillIn(75);
  page.rides[0].choose();
  page.foodExpenses.fillIn(25.50);
  page.notes.fillIn('These r the notes');
  page.donation.click();

  page.submitButton.click();

  andThen(function() {
    const changedRide = server.db.rides[1];

    assert.equal(changedRide.distance, 75);
    assert.equal(changedRide.foodExpenses, 2550);
    assert.equal(changedRide.reportNotes, 'These r the notes');
    assert.equal(changedRide.donation, true);

    assert.equal(currentURL(), '/reports/new');

    assert.equal(shared.toast.text, 'Your report was saved');
  });
});

test('a fallback shows when no rides need a report', function(assert) {
  authenticateSession(this.application);

  page.visit();

  page.distance.fillIn(75);
  page.rides[1].choose();
  page.submitButton.click();

  page.distance.fillIn(75);
  page.rides[0].choose();
  page.submitButton.click();

  andThen(function() {
    assert.ok(page.noRides.isVisible, 'expected there to be no rides to report on');
  });
});

test('submitting a report clears the form', function(assert) {
  page.visit();

  page.distance.fillIn(75);
  page.rides[0].choose();
  page.foodExpenses.fillIn(25.50);
  page.notes.fillIn('These r the notes');

  page.submitButton.click();

  andThen(function() {
    assert.equal(currentURL(), '/reports/new');
    assert.equal(page.distance.value, '', 'expected the distance field to be empty');
    assert.equal(page.foodExpenses.value, '', 'expected the food expenses to have been cleared');
    assert.equal(page.notes.value, '', 'expected the notes to be empty');
  });
});

test('partially completing a report and changing the ride doesn’t erase the values', function(assert) {
  const longReport = 'This is a very long report I would be sad to lose.';

  page.visit();

  page.notes.fillIn(longReport);

  page.rides[0].choose();

  andThen(() => {
    assert.equal(page.notes.value, longReport);
  });

  page.rides[1].choose();

  andThen(() => {
    assert.equal(page.notes.value, longReport);
  });
});

test('submitting a report without choosing a ride displays an error', function(assert) {
  page.visit();
  page.notes.fillIn('I cannot find my ride');
  page.submitButton.click();

  andThen(() => {
    assert.equal(shared.toast.text, 'Please choose a ride');
    assert.equal(page.notes.value, 'I cannot find my ride');
  });
});

test('a ride that is not donatable doesn’t show the donation checkbox', function(assert) {
  page.visit();
  page.rides[1].choose();

  andThen(() => {
    assert.ok(page.donation.isHidden, 'expected the donation checkbox to be hidden when a ride is not donatable');
  });
});

test('a failure to save keeps the values and displays an error', function(assert) {
  server.patch('/rides/:id', () => { return {}; }, 422);

  page.visit();

  page.distance.fillIn(75);
  page.rides[0].choose();

  page.submitButton.click();

  andThen(function() {
    assert.equal(shared.toast.text, 'There was an error saving your report!');

    assert.equal(currentURL(), '/reports/new');
    assert.equal(page.distance.value, '75', 'expected the distance field to have the same value');
  });
});
