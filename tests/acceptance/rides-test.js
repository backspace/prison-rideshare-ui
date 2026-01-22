/* eslint-disable qunit/assert-args, qunit/require-expect */
import { click, currentURL, findAll, waitUntil } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers/application-tests';
import percySnapshot from '@percy/ember';
import { Response } from 'miragejs';

import { authenticateSession } from 'ember-simple-auth/test-support';

import page from 'prison-rideshare-ui/tests/pages/rides';
import shared from 'prison-rideshare-ui/tests/pages/shared';
import { getPageTitle } from 'ember-page-title/test-support';

import moment from 'moment-timezone';
import { overrideRoute } from '../helpers/override-route';
import { selectChoose } from 'ember-power-select/test-support';

module('Acceptance | rides', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    this.server.create('user', { admin: true });
    await authenticateSession({ access_token: 'abcdef' });
  });

  test('list existing rides with sortability, hiding cancelled ones by default', async function (assert) {
    const leavenworth = this.server.create('institution', {
      name: 'Fort Leavenworth',
    });

    const sun = this.server.create('person', {
      name: 'Sun',
      email: 'sun@sense8',
      landline: '111',
      selfNotes: 'Some important notes',
    });

    const lito = this.server.create('person', {
      name: 'Lito',
    });

    this.server.create('ride', {
      enabled: false,
      cancellationReason: 'lockdown',

      name: 'Edward',
      address: '91 Albert',
      contact: 'jorts@example.com',
      passengers: 3,
      firstTime: true,
      medium: 'txt',
      institution: leavenworth,

      requestNotes: 'These are some request notes.',

      driver: sun,
      carOwner: lito,
      overridable: true,

      insertedAt: new Date(2016, 11, 20, 20, 15),
    });

    const chelseaRide = this.server.create('ride', {
      name: 'Chelsea',
      start: new Date(2016, 11, 25, 10, 15),
      end: new Date(2016, 11, 25, 12, 0),
      passengers: 1,
      contact: '5145551212',
      address: '421 osborne',
    });

    chelseaRide.createChild({
      combinedWith: chelseaRide,
      name: 'Visitor',
      start: new Date(2016, 11, 25, 10, 10),
      end: new Date(2016, 11, 25, 12, 10),
    });

    await page.visit();
    await percySnapshot(assert);

    assert.strictEqual(getPageTitle(), 'Rides · Prison Rideshare');
    assert.strictEqual(
      page.rides.length,
      2,
      'expected the cancelled ride to be hidden',
    );
    assert.notOk(
      page.head.cancelledSwitch.enabled,
      'expected the cancelled switch to be off',
    );

    await page.head.cancelledSwitch.click();

    assert.strictEqual(
      page.rides.length,
      3,
      'expected the cancelled ride to be shown',
    );

    const ride = page.rides[2];

    assert.notOk(ride.enabled, 'expected the later ride to not be enabled');
    assert.ok(
      ride.cancellation.showsLockdown,
      'expected the cancelled ride to show lockdown for the reason',
    );
    assert.strictEqual(ride.name, 'Edward + 2');
    assert.ok(
      ride.isFirstTimer,
      'expected the rider to be marked a first-timer',
    );
    assert.strictEqual(ride.date, 'Mon Dec 26 2016 8:30p — 10');
    assert.strictEqual(ride.institution, 'Fort Leavenworth');
    assert.strictEqual(ride.address, '91 Albert');
    assert.strictEqual(ride.contact, 'jorts@example.com');
    assert.ok(
      ride.medium.isTxt,
      'expected the request to have been received via txt',
    );
    assert.ok(
      ride.creationDate.isHidden,
      'expected the creation date to be hidden by default',
    );
    assert.ok(ride.isOverridable, 'expected the ride to be overridable');

    assert.strictEqual(ride.driver.text, 'Sun');
    assert.strictEqual(ride.carOwner.text, 'Lito');

    assert.strictEqual(
      page.notes.length,
      1,
      'expected the notes to be visible',
    );
    assert.strictEqual(page.notes[0].text, 'These are some request notes.');

    await page.rides[2].clickDate();

    assert.strictEqual(
      page.rides[2].creationDate.text,
      'Tue Dec 20 2016 8:15p',
    );

    await page.rides[2].clickDate();

    assert.ok(
      page.rides[2].creationDate.isHidden,
      'expected the creation date to be hidden again',
    );

    await page.rides[2].driver.reveal();

    await page.rides[2].as((ride) => {
      assert.strictEqual(ride.driver.email, 'sun@sense8');
      assert.strictEqual(ride.driver.landline, '111');
      assert.strictEqual(ride.driver.selfNotes, 'Some important notes');
    });

    await page.rides[2].edit();

    assert.strictEqual(page.form.notice, 'You are editing a cancelled ride!');

    assert.strictEqual(
      page.form.timespanResult.value,
      'Mon Dec 26 2016 8:30p — 10',
    );

    await page.form.timespan.fillIn('Dec 26 2300 from 9a to 11:30');
    assert.notOk(page.form.timespanResult.hasPastWarning);

    await page.form.timespan.fillIn('dec 26 2300 4pm to dec 29 11');
    assert.ok(page.form.timespanResult.hasDurationWarning);

    await page.form.cancel();

    assert.ok(page.rides[0].enabled, 'expected the other ride to be enabled');
    assert.notOk(
      page.rides[0].isFirstTimer,
      'expected the other ride to not be a first-timer',
    );
    assert.notOk(
      page.rides[0].isOverridable,
      'expected the other ride to not be overridable',
    );
    assert.ok(
      page.rides[0].cancellation.showsNotCancelled,
      'expected the other ride to not be cancelled',
    );
    assert.strictEqual(
      page.rides[0].name,
      'Chelsea',
      'expected the earlier ride to be sorted to the bottom',
    );
    assert.strictEqual(page.rides[0].contactPhoneHref, 'tel:5145551212');

    assert.ok(
      page.rides[1].name,
      'Visitor',
      'expected the combined ride to be beneath its parent',
    );
    assert.ok(
      page.rides[1].isCombined,
      'expected the combined ride to show it is combined',
    );

    await page.ridesHead.clickDate();

    assert.strictEqual(
      page.rides[1].name,
      'Chelsea',
      'expected the earlier ride to be sorted to the top',
    );

    await page.rides[0].cancellation.click();

    assert.ok(
      page.cancellationForm.cancelled.checked,
      'expected the cancellation box to be checked',
    );
    assert.strictEqual(page.cancellationForm.reason.value, 'lockdown');

    await page.cancellationForm.other.fillIn('visitor');
    await page.cancellationForm.save();

    assert.ok(
      page.rides[0].cancellation.showsVisitor,
      'expected the ride to now be cancelled by the visitor',
    );

    await page.rides[0].cancellation.click();
    await page.cancellationForm.other.fillIn('other!');
    await page.cancellationForm.save();

    assert.ok(
      page.rides[0].cancellation.showsOther,
      'expected the ride to now be cancelled with another reason',
    );
    assert.strictEqual(
      page.rides[0].cancellation.title,
      'Edit cancellation: other!',
    );

    await page.rides[0].cancellation.click();
    await page.cancellationForm.cancelled.click();
    await page.cancellationForm.save();

    assert.ok(
      page.rides[0].enabled,
      'expected the ride to no longer be cancelled',
    );
    assert.ok(
      page.rides[0].cancellation.showsNotCancelled,
      'expected the other ride to not be cancelled',
    );
    assert.notOk(
      page.rides[0].cancellation.showsVisitor,
      'expected the ride to not show the visitor as a reason',
    );
    assert.notOk(
      page.rides[0].cancellation.showsLockdown,
      'expected the ride not show lockdown as a reason',
    );

    await page.rides[0].cancellation.click();
    await page.cancellationForm.shortcutButtons[0].click();

    assert.ok(page.rides[0].cancellation.showsDriverNotFound);

    await page.rides[2].cancellation.click();
    await page.cancellationForm.reason.fillIn('lockdown');
    await page.cancellationForm.save();

    assert.ok(page.rides[2].cancellation.showsLockdown);

    const restoreRidePatch = overrideRoute(
      this.server,
      'patch',
      '/rides/:id',
      () => new Response(500, {}, {}),
    );

    await page.rides[2].cancellation.click();
    await page.cancellationForm.shortcutButtons[0].click();

    assert.strictEqual(
      shared.inlineAlert.text,
      'There was an error cancelling this ride',
    );

    restoreRidePatch();

    await page.cancellationForm.cancel();
    await page.rides[2].cancellation.click();
    await page.cancellationForm.shortcutButtons[0].click();

    assert.notOk(shared.inlineAlert.isPresent);

    await page.head.search.fillIn('Chelsea');
    await page.head.completedSwitch.click();

    const url = currentURL();

    assert.ok(
      url.includes('cancelled=true'),
      'expected the cancelled filter to be reflected in the URL',
    );
    assert.ok(
      url.includes('completed=true'),
      'expected the completed filter to be reflected in the URL',
    );
    assert.ok(
      url.includes('dir=desc'),
      'expected the sort direction to be reflected in the URL',
    );
    assert.ok(
      url.includes('search=Chelsea'),
      'expected the search query to be reflected in the URL',
    );
  });

  test('shows the end year when a ride spans years', async function (assert) {
    this.server.create('ride', {
      name: 'New Year Ride',
      start: new Date(2010, 11, 31, 23, 0),
      end: new Date(2011, 0, 1, 1, 0),
    });

    await page.visit();

    const newYearRide = page.rides[page.rides.length - 1];

    assert.ok(newYearRide, 'expected the new year ride to be present');
    assert.strictEqual(
      newYearRide.date,
      'Fri Dec 31 2010 11p — Sat Jan 1 2011 1a',
    );
  });

  test('selecting an existing visitor replaces the typed value', async function (assert) {
    this.server.create('ride', {
      name: 'Octavia Butler',
      address: '123 Earthseed Way',
      contact: '204-555-1111',
    });

    await page.visit();
    await page.newRide();

    // Choose by clicking option because text-matching component-rendered option is difficult in Power Select.
    await click('[data-test-visitor-select]');
    await page.form.name.searchInput.fillIn('Oct');
    await waitUntil(() =>
      findAll('.ember-power-select-option').some((option) =>
        option.textContent.includes('Octavia Butler'),
      ),
    );

    const option = findAll('.ember-power-select-option').find((el) =>
      el.textContent.includes('Octavia Butler'),
    );
    await click(option);

    assert.strictEqual(page.form.name.value, 'Octavia Butler');
    assert.strictEqual(page.form.address.value, '123 Earthseed Way');
    assert.strictEqual(page.form.contact.value, '204-555-1111');

    await page.form.address.click(); // blur the select to mimic mobile behavior

    assert.strictEqual(page.form.name.value, 'Octavia Butler');
  });

  test('completed rides can be shown and cleared', async function (assert) {
    this.server.create('ride');
    this.server.create('ride');
    this.server.create('ride', {
      distance: 44,
      carExpenses: 1010,
      rate: 26,
      foodExpenses: 5555,
      reportNotes: 'Some report notes?',
      complete: true,
    });
    this.server.create('ride', {
      distance: 0,
      carExpenses: 1010,
      rate: 26,
      foodExpenses: 5555,
      complete: true,
    });

    await page.visit();

    assert.strictEqual(
      page.rides.length,
      2,
      'expected the completed rides to be hidden',
    );
    assert.notOk(
      page.head.completedSwitch.enabled,
      'expected the completed switch to be off',
    );

    await page.head.completedSwitch.click();

    assert.strictEqual(
      page.rides.length,
      4,
      'expected the completed rides to be showing',
    );
    assert.ok(
      page.head.completedSwitch.enabled,
      'expected the completed switch to be on',
    );

    assert.strictEqual(
      page.reports.length,
      2,
      'expected the reports to be rendered',
    );
    assert.strictEqual(page.reports[0].distance, '44');
    assert.strictEqual(page.reports[0].carExpenses, '10.1');
    assert.strictEqual(page.reports[0].rate, '26 ¢⁄km');
    assert.strictEqual(page.reports[0].foodExpenses, '55.55');
    assert.strictEqual(page.reports[0].notes, 'Some report notes?');

    await page.rides[2].edit();
    await page.form.cancel();

    await page.reports[0].clear();

    assert.ok(
      page.reports[0].clearConfirm.isVisible,
      'expected the confirmation button to be visible',
    );
    assert.ok(
      page.reports[0].clearCancel.isVisible,
      'expected the cancellation button to be visible',
    );

    await page.reports[0].clearCancel.click();

    assert.ok(
      page.reports[0].clearConfirm.isHidden,
      'expected the confirmation button to be hidden again',
    );

    await page.reports[0].clear();
    await page.reports[0].clearConfirm.click();

    assert.strictEqual(
      page.reports.length,
      1,
      'expected the report to be gone',
    );

    const [, , ride] = this.server.db.rides;

    assert.notOk(
      ride.foodExpenses,
      'expected the food expenses to have been cleared on the server',
    );
    assert.notOk(
      ride.reportNotes,
      'expected the report notes to have been cleared on the server',
    );
    assert.notOk(
      ride.distance,
      'expected the distance to have been cleared on the server',
    );
  });

  test('create and edit a ride', async function (assert) {
    const rockwood = this.server.create('institution', {
      name: 'Rockwood',
    });

    this.server.create('institution', {
      name: 'Stony Mountain',
    });

    const sun = this.server.create('person', {
      name: 'Sun',
    });

    const lito = this.server.create('person', {
      name: 'Lito',
    });

    await page.visit();
    await page.newRide();

    assert.strictEqual(
      page.rides.length,
      0,
      'there should be no row for an unsaved ride',
    );
    assert.strictEqual(
      page.notes.length,
      0,
      'there should be no notes when there are no rides',
    );

    assert.strictEqual(
      page.form.passengers.value,
      '1',
      'the form should default to one passenger',
    );

    assert.ok(
      page.form.firstTimePoints.isHidden,
      'expected the first time tips to not be visible by default',
    );

    await page.form.timespan.fillIn('Dec 26 2016 from 9a to 11:30');

    assert.ok(page.form.timespanResult.hasPastWarning);

    await page.form.overridable.click();

    await page.form.medium.phone.click();
    await page.form.name.fillIn('Edward');
    await page.form.address.fillIn('114 Spence');
    await page.form.contact.fillIn('jants@example.com');
    await page.form.firstTime.click();
    await page.form.passengers.fillIn(2);

    assert.strictEqual(
      page.form.name.value,
      'Edward',
      'expected the typed visitor name to remain visible when no suggestion is chosen',
    );

    assert.ok(
      page.form.firstTimePoints.isVisible,
      'expected the first time tips to show after the checkbox is set',
    );

    // FIXME not really here, but keyboard input for this is broken, and hovering
    await page.form.institution.choose('Rockwood');

    await percySnapshot(assert);

    await page.form.submit();

    const ride = page.rides[0];
    assert.strictEqual(ride.name, 'Edward + 1');

    assert.ok(
      ride.medium.isPhone,
      'expected the ride request to have been received via phone',
    );
    assert.strictEqual(ride.date, 'Mon Dec 26 2016 9a — 11:30');

    assert.strictEqual(ride.institution, 'Rockwood');

    assert.ok(ride.isOverridable);

    let serverRides = this.server.db.rides;
    let lastRide = serverRides[serverRides.length - 1];

    assert.strictEqual(lastRide.medium, 'phone');
    assert.strictEqual(lastRide.name, 'Edward');
    assert.strictEqual(
      moment(lastRide.start).format('YYYY-MM-DD HH:mm'),
      '2016-12-26 09:00',
    );
    assert.strictEqual(
      moment(lastRide.end).format('YYYY-MM-DD HH:mm'),
      '2016-12-26 11:30',
    );
    assert.strictEqual(lastRide.address, '114 Spence');
    assert.strictEqual(lastRide.contact, 'jants@example.com');
    assert.ok(lastRide.firstTime);
    assert.strictEqual(lastRide.passengers, '2');
    assert.strictEqual(lastRide.institutionId, rockwood.id);
    assert.strictEqual(
      lastRide.requestNotes,
      undefined,
      'expected the notes to have been unspecified',
    );
    assert.ok(lastRide.overridable);

    await page.rides[0].driver.click();
    await page.rides[0].driver.choose('Sun');

    assert.strictEqual(page.rides[0].driver.text, 'Sun');
    assert.strictEqual(
      page.rides[0].carOwner.text,
      'Sun',
      'expected the car owner to be set automatically',
    );

    assert.strictEqual(
      page.notes.length,
      0,
      'expected no notes on the new ride',
    );

    serverRides = this.server.db.rides;
    lastRide = serverRides[serverRides.length - 1];

    assert.strictEqual(lastRide.driverId, sun.id);
    assert.strictEqual(lastRide.carOwnerId, sun.id);

    await page.rides[0].carOwner.clear();
    await page.rides[0].carOwner.select.click();
    await page.rides[0].carOwner.select.type({ key: 'L' });
    await page.rides[0].carOwner.select.enter();

    assert.strictEqual(page.rides[0].carOwner.text, 'Lito');

    serverRides = this.server.db.rides;
    lastRide = serverRides[serverRides.length - 1];

    assert.strictEqual(lastRide.carOwnerId, lito.id);

    await page.rides[0].edit();

    await page.form.name.fillIn('Ed');
    await page.form.cancel();

    assert.strictEqual(page.rides[0].name, 'Edward + 1');

    serverRides = this.server.db.rides;
    lastRide = serverRides[serverRides.length - 1];
    assert.strictEqual(lastRide.name, 'Edward');

    await page.rides[0].edit();

    await page.form.medium.email.click();
    await page.form.name.fillIn('Edwina');
    await page.form.notes.fillIn('Some request notes?');
    await page.form.firstTime.click();

    assert.strictEqual(
      page.rides[0].name,
      'Edward + 1',
      'expected the original model to not yet have changed',
    );

    await page.form.submit();

    assert.strictEqual(page.rides[0].name, 'Edwina + 1');

    assert.ok(
      page.rides[0].medium.isEmail,
      'expected the medium to now be email',
    );
    assert.strictEqual(
      page.notes.length,
      1,
      'expected the notes for the new ride to show',
    );
    assert.strictEqual(page.notes[0].text, 'Some request notes?');

    serverRides = this.server.db.rides;
    lastRide = serverRides[serverRides.length - 1];
    assert.strictEqual(lastRide.name, 'Edwina');
    assert.strictEqual(lastRide.requestNotes, 'Some request notes?');
    assert.notOk(lastRide.firstTime);
    assert.strictEqual(lastRide.medium, 'email');

    const restoreRideSave = overrideRoute(
      this.server,
      'patch',
      '/rides/:id',
      () => new Response(500, {}, {}),
    );

    await page.rides[0].edit();
    await page.form.notes.fillIn('Updated request notes?');
    await page.form.submit();

    assert.strictEqual(
      shared.inlineAlert.text,
      'There was an error saving this ride',
    );
    // assert.strictEqual(page.notes[0].text, 'Some request notes?'); FIXME lost due to fix for #123
    assert.strictEqual(page.form.notes.value, 'Updated request notes?');

    restoreRideSave();

    await page.form.submit();
    assert.notOk(shared.inlineAlert.isPresent);
  });

  test('a visitor name can be entered manually even when matches exist', async function (assert) {
    const rockwood = this.server.create('institution', {
      name: 'Rockwood',
    });

    this.server.create('ride', {
      name: 'Greyson',
      address: '91 Albert St.',
      contact: 'greyson@example.com',
      institution: rockwood,
      start: new Date(2016, 11, 20, 9, 0),
      end: new Date(2016, 11, 20, 11, 0),
    });

    await page.visit();
    await page.newRide();

    await page.form.name.fillIn('gre');

    await waitUntil(() => page.form.name.suggestions.length >= 2);

    assert.strictEqual(page.form.name.suggestions[0].name, 'Greyson');
    assert.strictEqual(
      page.form.name.suggestions[1].name,
      'Use “gre” as visitor name',
      'expected the manual option to be listed last',
    );

    await selectChoose(
      '[data-test-visitor-select]',
      'Use “gre” as visitor name',
    );

    assert.strictEqual(page.form.name.value, 'gre');
    assert.strictEqual(page.form.address.value, '');
    assert.strictEqual(page.form.contact.value, '');
  });

  test('ride times can be entered manually', async function (assert) {
    this.server.create('institution', {
      name: 'Rockwood',
    });

    await page.visit();
    await page.newRide();

    assert.ok(page.form.timespanStart.isHidden);
    assert.ok(page.form.timespanEnd.isHidden);

    await page.form.timespanOverrideButton.click();

    assert.ok(page.form.timespanOverrideButton.isDisabled);
    assert.ok(page.form.timespanStart.isVisible);

    await page.form.timespan.fillIn('Dec 26 2016 from 9a to 11:30');

    assert.strictEqual(page.form.timespanStart.value, '2016-12-26T09:00');
    assert.strictEqual(page.form.timespanEnd.value, '2016-12-26T11:30');

    await page.form.timespanStart.fillIn('2016-12-26T09:55');

    await page.form.name.fillIn('Edward');
    await page.form.address.fillIn('114 Spence');
    await page.form.contact.fillIn('jants@example.com');

    // FIXME not really here, but keyboard input for this is broken, and hovering
    await page.form.institution.choose('Rockwood');

    await page.form.submit();

    const ride = page.rides[0];
    assert.strictEqual(ride.date, 'Mon Dec 26 2016 9:55a — 11:30');
  });

  test('matching visitors are suggested with some deduplication', async function (assert) {
    this.server.create('ride', { name: 'Francine', contact: 'jorts@jants.ca' });
    this.server.create('ride', { name: 'Pascal' });
    this.server.create('ride', {
      name: 'frank',
      address: '91 Albert St.',
      contact: 'frank@jants.ca',
    });
    this.server.create('ride', {
      name: 'Frank',
      address: '91 Albert St.',
      contact: 'frank@jants.ca',
    });

    await page.visit();
    await page.newRide();

    await page.form.name.fillIn('fran');
    await waitUntil(() => page.form.name.suggestions.length);

    assert.strictEqual(page.form.name.suggestions.length, 3);

    await page.form.name.suggestions[0].as((francine) => {
      assert.strictEqual(francine.name, 'Francine');
      assert.strictEqual(francine.contact, 'jorts@jants.ca');
    });

    await page.form.name.suggestions[1].as((frank) => {
      assert.strictEqual(frank.name, 'frank');
      assert.strictEqual(frank.address, '91 Albert St.');
      assert.strictEqual(frank.contact, 'frank@jants.ca');
    });

    assert.strictEqual(
      page.form.name.suggestions[2].name,
      'Use “fran” as visitor name',
    );

    await page.form.name.suggestions[1].click();

    assert.strictEqual(page.form.name.text, 'frank');
    assert.strictEqual(page.form.contact.value, 'frank@jants.ca');
    assert.strictEqual(page.form.address.value, '91 Albert St.');
  });

  test('timespan validation errors are shown when manual overrides are not used', async function (assert) {
    this.server.post(
      '/rides',
      {
        errors: [
          {
            source: {
              pointer: '/data/attributes/start',
            },
            detail: 'Start must be present',
          },
          {
            source: {
              pointer: '/data/attributes/end',
            },
            detail: 'End must be present',
          },
        ],
      },
      422,
    );

    await page.visit();
    await page.newRide();

    assert.ok(
      page.form.timespanStart.isHidden,
      'expected manual start time field to be hidden before override',
    );
    assert.ok(page.form.timespanEnd.isHidden);

    await page.form.submit();

    assert.strictEqual(page.form.timespanErrors.length, 2);

    assert.strictEqual(
      page.form.timespanErrors[0].text,
      'Start must be present',
    );
    assert.strictEqual(page.form.timespanErrors[1].text, 'End must be present');

    this.server.post('/rides');
  });

  test('ride validation errors are displayed but can be recovered from', async function (assert) {
    this.server.post(
      '/rides',
      {
        errors: [
          {
            source: {
              pointer: '/data/attributes/name',
            },
            detail: "Name can't be blank",
          },
          {
            source: {
              pointer: '/data/attributes/institution',
            },
            detail: "Institution can't be blank",
          },
          {
            source: {
              pointer: '/data/attributes/end',
            },
            detail: 'End must be after start',
          },
        ],
      },
      422,
    );

    await page.visit();
    await page.newRide();
    await page.form.timespanOverrideButton.click();

    assert.true(page.form.nameError.isHidden);
    assert.true(page.form.institutionError.isHidden);

    await page.form.submit();

    assert.strictEqual(page.form.nameError.text, "Name can't be blank");
    // PaperSelect stopped rendering errors! See #177
    //assert.strictEqual(page.form.institutionError.text, "Institution can't be blank");
    assert.strictEqual(
      page.form.timespanEndError.text,
      'End must be after start',
    );

    this.server.post('/rides');

    await page.form.name.fillIn('Hello');
    await page.form.submit();

    const serverRides = this.server.db.rides;
    const lastRide = serverRides[serverRides.length - 1];
    assert.strictEqual(lastRide.name, 'Hello');
  });

  test('rides can be combined and uncombined, cancelling a parent ride shows a warning', async function (assert) {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 1000 * 60 * 60 * 24);

    this.server.create('ride', {
      name: 'A',
      passengers: 1,
      start: today,
      end: today,
    });
    const parentRide = this.server.create('ride', {
      name: 'B',
      passengers: 1,
      start: today,
      end: today,
    });
    this.server.create('ride', {
      name: 'C',
      passengers: 1,
      start: tomorrow,
      end: tomorrow,
    });
    this.server.create('ride', { name: 'D', combinedWith: parentRide });

    await page.visit();

    assert.notOk(
      page.rides[1].date.includes(today.getFullYear()),
      'expected the year to be hidden when the date is in the current year',
    );
    assert.ok(
      page.rides[1].combineButton.isHidden,
      'expected a ride that already has one combined with it to not a have a button to combine',
    );

    await page.rides[1].cancellation.click();

    assert.strictEqual(
      page.cancellationForm.notice,
      'Cancelling a ride with rides combined into it will cause the combined rides to also disappear. Uncombine them if this is undesirable.',
    );

    await page.rides[0].combineButton.click();

    assert.ok(
      page.rides[0].combineButton.isActive,
      'expected the combine button to indicate it is active',
    );
    assert.strictEqual(page.rides[0].combineButton.title, 'Cancel combining');

    assert.ok(
      page.rides[1].combineButton.isVisible,
      'expected the already-combined-with ride to be combinable-with',
    );

    assert.notOk(
      page.rides[1].isUncombinable,
      'expected the ride on the same day to be combinable',
    );
    assert.ok(
      page.rides[2].combineButton.isHidden,
      'expected a ride that has already been combined into another to not be combinable-into',
    );
    assert.ok(
      page.rides[3].isUncombinable,
      'expected the ride on the day before to not be combinable',
    );

    await page.rides[0].combineButton.click();

    assert.notOk(
      page.rides[0].combineButton.isActive,
      'expected the button to have become inactive after clicking',
    );
    assert.strictEqual(
      page.rides[0].combineButton.title,
      'Combine with another ride',
    );

    await page.rides[0].combineButton.click();
    await page.rides[3].combineButton.click();

    assert.strictEqual(
      page.rides[2].name,
      'C',
      'expected the combined-into ride to have moved',
    );
    assert.strictEqual(
      page.rides[3].name,
      'A',
      'expected the combined ride to have moved',
    );
    assert.ok(
      page.rides[3].isCombined,
      'expected the combined ride to show as combined',
    );
    assert.strictEqual(
      page.rides[3].combineButton.title,
      'Uncombine this ride',
    );

    await page.rides[3].combineButton.click();

    assert.strictEqual(
      page.rides[0].name,
      'A',
      'expected the formerly-combined ride to have returned',
    );
  });

  test('rides can be filtered by various characteristics', async function (assert) {
    const stonyMountain = this.server.create('institution', {
      name: 'Stony Mountain',
    });

    const burnham = this.server.create('person', {
      name: 'Michael Burnham',
      email: 'burnham@discovery',
      landline: '111',
    });

    const lorca = this.server.create('person', {
      name: 'Gabriel Lorca',
      email: 'lorca@discovery',
    });

    this.server.create('ride', {
      enabled: false,
      name: 'Philippa Georgiou',
      address: '91 Albert',
      contact: 'jorts@example.com',
      institution: stonyMountain,

      requestNotes: 'These are some request notes.',

      driver: burnham,
      carOwner: lorca,
    });

    this.server.create('ride', {
      name: 'Chelsea',
      start: new Date(2016, 11, 25, 10, 15),
      end: new Date(2016, 11, 25, 12, 0),
      passengers: 1,
      contact: '5145551212',
    });

    this.server.create('ride', {
      name: 'NEVERMATCH',
    });

    await page.visit();

    assert.strictEqual(
      page.rides.length,
      2,
      'expected two rides to show by default',
    );

    await page.head.search.fillIn('chel');

    assert.strictEqual(
      page.rides.length,
      1,
      'expected one ride to be showing after filtering',
    );
    assert.strictEqual(
      page.rides[0].name,
      'Chelsea',
      'expected the ride to be the Chelsea one',
    );

    await page.head.search.fillIn('');

    assert.strictEqual(
      page.rides.length,
      2,
      'expected the ride list to be returned to its default state',
    );

    await page.head.search.fillIn('HEL');

    assert.strictEqual(
      page.rides[0].name,
      'Chelsea',
      'expected the search to be case-insensitive',
    );

    await page.head.search.fillIn('non-matching search');

    assert.ok(
      page.noMatchesRow.isVisible,
      'expected the no matches row to show with non-matching search',
    );
  });

  test('a divider highlights past from present/future rides', async function (assert) {
    const week = 7 * 24 * 60 * 60 * 1000;
    const nowMilliseconds = new Date().getTime();
    const twoWeeksAgo = new Date(nowMilliseconds - week * 2);
    const lastWeek = new Date(nowMilliseconds - week);
    const nextWeek = new Date(nowMilliseconds + week);

    this.server.create('ride', {
      start: twoWeeksAgo,
      end: twoWeeksAgo,
    });

    this.server.create('ride', {
      start: lastWeek,
      end: lastWeek,
    });

    this.server.create('ride', {
      start: nextWeek,
      end: nextWeek,
    });

    await page.visit();

    assert.ok(
      page.rides[2].isDivider,
      'expected the first future ride to have a divider above it',
    );

    await page.ridesHead.clickDate();

    assert.ok(
      page.rides[1].isDivider,
      'expected the first past ride to have a divider above it',
    );
  });

  test('uncancelled requests for the future that have not been confirmed are highlighted and noted in the sidebar', async function (assert) {
    const week = 7 * 24 * 60 * 60 * 1000;
    const nowMilliseconds = new Date().getTime();
    const twoWeeksAgo = new Date(nowMilliseconds - week * 2);
    const nextWeek = new Date(nowMilliseconds + week);

    this.server.create('ride', {
      start: twoWeeksAgo,
      end: twoWeeksAgo,
      requestConfirmed: false,
    });

    this.server.create('ride', {
      start: nextWeek,
      end: nextWeek,
      medium: 'txt',
      requestConfirmed: false,
    });

    this.server.create('ride', {
      start: nextWeek,
      end: nextWeek,
      medium: 'phone',
      requestConfirmed: false,
      requestNotes: 'Needs confirmation',
    });

    this.server.create('ride', {
      start: nextWeek,
      end: nextWeek,
      enabled: false,
      requestConfirmed: false,
    });

    await page.visit();
    await page.head.cancelledSwitch.click();
    await page.head.completedSwitch.click();

    assert.strictEqual(page.confirmationNotifications.length, 2);

    assert.ok(page.rides[1].isHighlighted);

    // Confusing: the first row with notes is the third ride
    const rideWithNotes = page.rides[2];
    const notes = page.notes[0];

    assert.ok(rideWithNotes.isHighlighted);
    assert.ok(notes.isHighlighted);

    assert.strictEqual(shared.ridesBadge.text, '2');

    await rideWithNotes.edit();
    await page.form.requestConfirmed.click();
    await page.form.submit();

    assert.strictEqual(page.confirmationNotifications.length, 1);
    assert.notOk(rideWithNotes.isHighlighted);
    assert.notOk(notes.isHighlighted);
    assert.strictEqual(shared.ridesBadge.text, '1');

    await page.confirmationNotifications[0].markConfirmed();

    assert.strictEqual(page.confirmationNotifications.length, 0);
    assert.notOk(page.rides[1].isHighlighted);
    assert.ok(shared.ridesBadge.isHidden);
  });
});
