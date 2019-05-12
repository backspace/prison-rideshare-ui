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

    this.server.create('ride', {
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

    this.server.create('ride', {
      name: 'Assata',
      distance: 100,
      complete: true,
    });

    this.server.patch('/rides/:id', function({ rides }, { params: { id } }) {
      let ride = rides.find(id);
      let attrs = this.normalizedRequestAttrs('ride');

      ride.update(attrs);
      ride.complete = true;
      ride.save();

      return ride;
    });
  });

  test('submit a report for a ride', async function(assert) {
    await page.visit();

    assert.equal(shared.title, 'Ride report · Prison Rideshare');

    assert.equal(page.rides.length, 2, 'expected two rides to choose from');
    assert.ok(page.noSession.isHidden);

    assert.equal(
      page.rides[0].label,
      'francine: Sun, Dec 25 at 10:15a to Remand Centre (33¢⁄km )'
    );
    assert.equal(
      page.rides[1].label,
      'Tue, Dec 27 at 5:00p to Fort Leavenworth'
    );

    await page.rides[0].choose();
    await page.distance.fillIn(75);
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
    assert.equal(
      page.rides.length,
      1,
      'expected the reported-on ride to have disappeared'
    );
    assert.equal(
      page.rides[0].label,
      'Tue, Dec 27 at 5:00p to Fort Leavenworth'
    );
  });

  test('a fallback shows when no rides need a report', async function(assert) {
    this.server.db.rides.remove();
    await page.visit();

    assert.ok(
      page.noRides.isVisible,
      'expected there to be no rides to report on'
    );
  });

  test('the report interface is hidden when a user is logged in', async function(assert) {
    authenticateSession(this.application);

    await page.visit();

    assert.equal(page.rides.length, 0);
    assert.ok(page.noSession.isVisible);
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

  test('unsaved changes are discarded when the selected ride changes', async function(assert) {
    await page.visit();

    await page.rides[0].choose();
    await page.distance.fillIn(75);

    await page.rides[1].choose();
    await page.rides[0].choose();

    assert.equal(page.distance.value, '');
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

    await page.rides[0].choose();
    await page.distance.fillIn(75);

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
