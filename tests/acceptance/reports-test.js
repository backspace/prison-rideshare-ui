import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers/application-tests';

import { authenticateSession } from 'ember-simple-auth/test-support';

import page from 'prison-rideshare-ui/tests/pages/report';
import shared from 'prison-rideshare-ui/tests/pages/shared';

module('Acceptance | reports', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    const leavenworth = this.server.create('institution', {
      name: 'Fort Leavenworth',
    });

    const remand = this.server.create('institution', {
      name: 'Remand Centre',
    });

    const edwardRide = this.server.create('ride', {
      name: 'Edward',
      start: new Date(2016, 11, 27, 17, 0),
      end: new Date(2016, 11, 27, 19, 0),
      passengers: 1,
      institution: leavenworth,
      donatable: false,
    });

    this.server.create('ride', {
      name: 'Chelsea',
      start: new Date(2016, 11, 25, 10, 15),
      end: new Date(2016, 11, 25, 12, 0),
      passengers: 1,
      institution: remand,
      rate: 33,
      initials: 'francine',
      donatable: true,
      overridable: true,
    });

    this.server.create('ride', { enabled: false });

    this.server.create('ride', {
      name: 'Assata',
      distance: 100,
    });

    this.server.create('ride', { combinedWith: edwardRide });

    // This ride should not display because it’s in the future.
    this.server.create('ride', {
      name: 'Future',
      start: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
      end: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 + 1000),
    });
  });

  test('submit a report for a ride', async function(assert) {
    authenticateSession(this.application);

    await page.visit();

    assert.equal(shared.title, 'Ride report · Prison Rideshare');

    assert.equal(page.rides.length, 2, 'expected two rides to choose from');

    assert.equal(
      page.rides[0].label,
      'francine: Sun, Dec 25 at 10:15a to Remand Centre (33¢⁄km )'
    );
    assert.equal(
      page.rides[1].label,
      'Tue, Dec 27 at 5:00p to Fort Leavenworth'
    );

    await page.distance.fillIn(75);
    await page.rides[0].choose();
    await page.foodExpenses.fillIn(25.5);
    await page.carExpenses.fillIn(52.05);
    await page.notes.fillIn('These r the notes');
    await page.donation.click();

    await page.submitButton.click();

    const changedRide = this.server.db.rides[1];

    assert.equal(changedRide.distance, 75);
    assert.equal(changedRide.foodExpenses, 2550);
    assert.equal(changedRide.carExpenses, 5205);
    assert.equal(changedRide.reportNotes, 'These r the notes');
    assert.equal(changedRide.donation, true);

    assert.equal(currentURL(), '/reports/new');

    assert.equal(shared.toast.text, 'Your report was saved');
  });

  test('a fallback shows when no rides need a report', async function(assert) {
    authenticateSession(this.application);

    await page.visit();

    await page.distance.fillIn(75);
    await page.rides[1].choose();
    await page.submitButton.click();

    await page.distance.fillIn(75);
    await page.rides[0].choose();
    await page.submitButton.click();

    assert.ok(
      page.noRides.isVisible,
      'expected there to be no rides to report on'
    );
  });

  test('submitting a report clears the form', async function(assert) {
    await page.visit();

    await page.distance.fillIn(75);
    await page.rides[0].choose();
    await page.foodExpenses.fillIn(25.5);
    await page.notes.fillIn('These r the notes');

    await page.submitButton.click();

    assert.equal(currentURL(), '/reports/new');
    assert.equal(
      page.distance.value,
      '',
      'expected the distance field to be empty'
    );
    assert.equal(
      page.foodExpenses.value,
      '',
      'expected the food expenses to have been cleared'
    );
    assert.equal(page.notes.value, '', 'expected the notes to be empty');
  });

  test('partially completing a report and changing the ride doesn’t erase the values', async function(assert) {
    const longReport = 'This is a very long report I would be sad to lose.';

    await page.visit();

    await page.notes.fillIn(longReport);

    await page.rides[0].choose();

    assert.equal(page.notes.value, longReport);

    await page.rides[1].choose();

    assert.equal(page.notes.value, longReport);
  });

  test('submitting a report without choosing a ride displays an error', async function(assert) {
    await page.visit();
    await page.notes.fillIn('I cannot find my ride');
    await page.submitButton.click();

    assert.equal(shared.toast.text, 'Please choose a ride');
    assert.equal(page.notes.value, 'I cannot find my ride');
  });

  test('a ride that is not donatable doesn’t show the donation checkbox, same for overridable and car expenses', async function(assert) {
    await page.visit();
    await page.rides[1].choose();

    assert.ok(
      page.donation.isHidden,
      'expected the donation checkbox to be hidden when a ride is not donatable'
    );
    assert.ok(
      page.carExpenses.isHidden,
      'expected the car expenses field to be hidden when a ride is not overridable'
    );
  });

  test('a failure to save keeps the values and displays an error', async function(assert) {
    this.server.patch(
      '/rides/:id',
      () => {
        return {};
      },
      422
    );

    await page.visit();

    await page.distance.fillIn(75);
    await page.rides[0].choose();

    await page.submitButton.click();

    assert.equal(shared.toast.text, 'There was an error saving your report!');

    assert.equal(currentURL(), '/reports/new');
    assert.equal(
      page.distance.value,
      '75',
      'expected the distance field to have the same value'
    );
  });
});
