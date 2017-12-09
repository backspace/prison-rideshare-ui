import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import page from 'prison-rideshare-ui/tests/pages/rides';
import shared from 'prison-rideshare-ui/tests/pages/shared';

import moment from 'moment';

moduleForAcceptance('Acceptance | rides', {
  beforeEach() {
    authenticateSession(this.application);
  }
});

test('list existing rides with sortability, hiding cancelled ones by default', function(assert) {
  const leavenworth = server.create('institution', {
    name: 'Fort Leavenworth'
  });

  const sun = server.create('person', {
    name: 'Sun',
    email: 'sun@sense8',
    landline: '111'
  });

  const lito = server.create('person', {
    name: 'Lito'
  });

  server.create('ride', {
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

    insertedAt: new Date(2016, 11, 20, 20, 15)
  });

  const chelseaRide = server.create('ride', {
    name: 'Chelsea',
    start: new Date(2016, 11, 25, 10, 15),
    end: new Date(2016, 11, 25, 12, 0),
    passengers: 1,
    contact: '5145551212'
  });

  chelseaRide.createChild({
    combinedWith: chelseaRide,
    name: 'Visitor'
  });

  page.visit();

  andThen(() => {
    assert.equal(shared.title, 'Rides · Prison Rideshare');

    assert.equal(page.rides().count, 2, 'expected the cancelled ride to be hidden');
    assert.notOk(page.head.cancelledSwitch.enabled, 'expected the cancelled switch to be off');
  });

  page.head.cancelledSwitch.click();

  andThen(function() {
    assert.equal(page.rides().count, 3, 'expected the cancelled ride to be shown');

    const ride = page.rides(2);

    assert.notOk(ride.enabled, 'expected the later ride to not be enabled');
    assert.ok(ride.cancellation.showsLockdown, 'expected the cancelled ride to show lockdown for the reason');
    assert.equal(ride.name, 'Edward + 2');
    assert.ok(ride.isFirstTimer, 'expected the rider to be marked a first-timer');
    assert.equal(ride.date, 'Mon Dec 26 2016 8:30pm — 10:00');
    assert.equal(ride.institution, 'Fort Leavenworth');
    assert.equal(ride.address, '91 Albert');
    assert.equal(ride.contact, 'jorts@example.com');
    assert.ok(ride.medium.isTxt, 'expected the request to have been received via txt');
    assert.ok(ride.creationDate.isHidden, 'expected the creation date to be hidden by default');

    assert.equal(ride.driver.text, 'Sun');
    assert.equal(ride.carOwner.text, 'Lito');

    assert.equal(page.notes().count, 1, 'expected the notes to be visible');
    assert.equal(page.notes(0).text, 'These are some request notes.');
  });

  page.rides(2).clickDate();

  andThen(() => {
    assert.equal(page.rides(2).creationDate.text, 'Tue Dec 20 2016 8:15pm');
  });

  page.rides(2).clickDate();

  andThen(() => {
    assert.ok(page.rides(2).creationDate.isHidden, 'expected the creation date to be hidden again');
  })

  page.rides(2).driver.reveal();

  andThen(() => {
    page.rides(2).as(ride => {
      assert.equal(ride.driver.email, 'sun@sense8');
      assert.equal(ride.driver.landline, '111');
    });
  });

  page.rides(2).edit();

  andThen(() => {
    assert.equal(page.form.notice, 'You are editing a cancelled ride!');

    assert.ok(page.form.start.value.startsWith('Mon Dec 26 2016 20:30:00'), `expected the start time ${page.form.start.value} to start with 'Mon Dec 26 2016 20:30:00'`);
    assert.ok(page.form.end.value.startsWith('Mon Dec 26 2016 22:00:00'), `expected the end time ${page.form.end.value} to end with 'Mon Dec 26 2016 22:00:00'`);
  });

  page.form.cancel();

  andThen(() => {
    assert.ok(page.rides(0).enabled, 'expected the other ride to be enabled');
    assert.notOk(page.rides(0).isFirstTimer, 'expected the other ride to not be a first-timer');
    assert.ok(page.rides(0).cancellation.showsNotCancelled, 'expected the other ride to not be cancelled');
    assert.equal(page.rides(0).name, 'Chelsea', 'expected the earlier ride to be sorted to the bottom');
    assert.equal(page.rides(0).contactPhoneHref, 'tel:5145551212');

    assert.ok(page.rides(1).name, 'Visitor', 'expected the combined ride to be beneath its parent');
    assert.ok(page.rides(1).isCombined, 'expected the combined ride to show it is combined');
  });

  page.rides().head.clickDate();

  andThen(function() {
    assert.equal(page.rides(1).name, 'Chelsea', 'expected the earlier ride to be sorted to the top');
  });

  page.rides(0).cancellation.click();

  andThen(function() {
    assert.ok(page.cancellationForm.cancelled.checked, 'expected the cancellation box to be checked');
    assert.equal(page.cancellationForm.reason.value, 'lockdown');
  });

  // FIXME why did this stop working with Ember Paper beta 2?
  // selectChoose('md-input-container.reason', 'visitor');
  page.cancellationForm.other.fillIn('visitor');
  page.cancellationForm.save();

  andThen(function() {
    assert.ok(page.rides(0).cancellation.showsVisitor, 'expected the ride to now be cancelled by the visitor');
  });

  page.rides(0).cancellation.click();
  page.cancellationForm.other.fillIn('other!');
  page.cancellationForm.save();

  andThen(function() {
    assert.ok(page.rides(0).cancellation.showsOther, 'expected the ride to now be cancelled with another reason');
    assert.equal(page.rides(0).cancellation.title, 'Edit cancellation: other!');
  });

  page.rides(0).cancellation.click();
  page.cancellationForm.cancelled.click();
  page.cancellationForm.save();

  andThen(function() {
    assert.ok(page.rides(0).enabled, 'expected the ride to no longer be cancelled');
    assert.ok(page.rides(0).cancellation.showsNotCancelled, 'expected the other ride to not be cancelled');
    assert.notOk(page.rides(0).cancellation.showsVisitor, 'expected the ride to not show the visitor as a reason');
    assert.notOk(page.rides(0).cancellation.showsLockdown, 'expected the ride not show lockdown as a reason');
  });
});

test('completed rides can be shown', function(assert) {
  server.create('ride');
  server.create('ride');
  server.create('ride', {
    distance: 44,
    foodExpenses: 5555,
    reportNotes: 'Some report notes?'
  });

  page.visit();

  andThen(() => {
    assert.equal(page.rides().count, 2, 'expected the completed ride to be hidden');
    assert.notOk(page.head.completedSwitch.enabled, 'expected the completed switch to be off');
  });

  page.head.completedSwitch.click();

  andThen(() => {
    assert.equal(page.rides().count, 3, 'expected the completed ride to be showing');
    assert.ok(page.head.completedSwitch.enabled, 'expected the completed switch to be on');

    assert.equal(page.reports().count, 1, 'expected the report to be rendered');
    assert.equal(page.reports(0).distance, '44');
    assert.equal(page.reports(0).foodExpenses, '55.55');
    assert.equal(page.reports(0).notes, 'Some report notes?');
  });

  page.rides(2).edit();
  andThen(() => assert.equal(page.form.notice, 'You are editing a ride that has already had its report completed!'));
  page.form.cancel();
});

test('create and edit a ride', function(assert) {
  const rockwood = server.create('institution', {
    name: 'Rockwood'
  });

  server.create('institution', {
    name: 'Stony Mountain'
  });

  const sun = server.create('person', {
    name: 'Sun'
  });

  const lito = server.create('person', {
    name: 'Lito'
  });

  page.visit();
  page.newRide();

  andThen(() => {
    assert.equal(page.rides().count, 0, 'there should be no row for an unsaved ride');
    assert.equal(page.notes().count, 0, 'there should be no notes when there are no rides');

    assert.equal(page.form.passengers.value, '1', 'the form should default to one passenger');

    assert.ok(page.form.firstTimePoints.isHidden, 'expected the first time tips to not be visible by default');
  });

  page.form.timespan.fillIn('Dec 26 2016 from 9am to 11:30');

  page.form.medium.phone.click();
  page.form.name.fillIn('Edward');
  page.form.address.fillIn('114 Spence');
  page.form.contact.fillIn('jants@example.com');
  page.form.firstTime.click();
  page.form.passengers.fillIn(2);

  andThen(() => {
    assert.ok(page.form.firstTimePoints.isVisible, 'expected the first time tips to show after the checkbox is set');
  });

  // FIXME not really here, but keyboard input for this is broken, and hovering
  selectChoose('md-input-container.institution', 'Rockwood');

  page.form.submit();

  andThen(function() {
    const ride = page.rides(0);
    assert.equal(ride.name, 'Edward + 1');

    assert.ok(ride.medium.isPhone, 'expected the ride request to have been received via phone');
    assert.equal(ride.date, 'Mon Dec 26 2016 9:00am — 11:30');

    assert.equal(ride.institution, 'Rockwood');

    const serverRides = server.db.rides;
    const lastRide = serverRides[serverRides.length - 1];

    assert.equal(lastRide.medium, 'phone');
    assert.equal(lastRide.name, 'Edward');
    assert.equal(moment(lastRide.start).format('YYYY-MM-DD HH:mm'), '2016-12-26 09:00');
    assert.equal(moment(lastRide.end).format('YYYY-MM-DD HH:mm'), '2016-12-26 11:30');
    assert.equal(lastRide.address, '114 Spence');
    assert.equal(lastRide.contact, 'jants@example.com');
    assert.ok(lastRide.firstTime);
    assert.equal(lastRide.passengers, 2);
    assert.equal(lastRide.institutionId, rockwood.id);
    assert.equal(lastRide.requestNotes, undefined, 'expected the notes to have been unspecified');
  });

  page.rides(0).driver.click();
  selectChoose('.driver md-input-container', 'Sun');

  andThen(function() {
    assert.equal(page.rides(0).driver.text, 'Sun');
    assert.equal(page.rides(0).carOwner.text, 'Sun', 'expected the car owner to be set automatically');

    assert.equal(page.notes().count, 0, 'expected no notes on the new ride');

    const serverRides = server.db.rides;
    const lastRide = serverRides[serverRides.length - 1];

    assert.equal(lastRide.driverId, sun.id);
    assert.equal(lastRide.carOwnerId, sun.id);
  });

  page.rides(0).carOwner.clear();
  selectChoose('.car-owner md-input-container', 'Lito');

  andThen(function() {
    assert.equal(page.rides(0).carOwner.text, 'Lito');

    const serverRides = server.db.rides;
    const lastRide = serverRides[serverRides.length - 1];

    assert.equal(lastRide.carOwnerId, lito.id);
  });

  page.rides(0).edit();

  page.form.name.fillIn('Ed');
  page.form.cancel();

  andThen(function() {
    assert.equal(page.rides(0).name, 'Edward + 1');

    const serverRides = server.db.rides;
    const lastRide = serverRides[serverRides.length - 1];
    assert.equal(lastRide.name, 'Edward');
  });

  page.rides(0).edit();

  page.form.medium.email.click();
  page.form.name.fillIn('Edwina');
  page.form.notes.fillIn('Some request notes?');
  page.form.firstTime.click();

  andThen(() => {
    assert.equal(page.rides(0).name, 'Edward + 1', 'expected the original model to not yet have changed');
  });

  page.form.submit();

  andThen(function() {
    assert.equal(page.rides(0).name, 'Edwina + 1');

    assert.ok(page.rides(0).medium.isEmail, 'expected the medium to now be email');
    assert.equal(page.notes().count, 1, 'expected the notes for the new ride to show');
    assert.equal(page.notes(0).text, 'Some request notes?');

    const serverRides = server.db.rides;
    const lastRide = serverRides[serverRides.length - 1];
    assert.equal(lastRide.name, 'Edwina');
    assert.equal(lastRide.requestNotes, 'Some request notes?');
    assert.notOk(lastRide.firstTime);
    assert.equal(lastRide.medium, 'email');
  });
});

test('matching visitors are suggested with some deduplication', function(assert) {
  server.create('ride', { name: 'Francine', contact: 'jorts@jants.ca' });
  server.create('ride', { name: 'Pascal' });
  server.create('ride', { name: 'frank', address: '91 Albert St.', contact: 'frank@jants.ca' });
  server.create('ride', { name: 'Frank', address: '91 Albert St.', contact: 'frank@jants.ca' });

  page.visit();
  page.newRide();

  page.form.name.fillIn('fran');

  andThen(() => {
    assert.equal(page.form.name.suggestions().count, 2);

    page.form.name.suggestions(0).as(francine => {
      assert.equal(francine.name, 'Francine');
      assert.equal(francine.contact, 'jorts@jants.ca');
    });

    page.form.name.suggestions(1).as(frank => {
      assert.equal(frank.name, 'frank');
      assert.equal(frank.address, '91 Albert St.');
      assert.equal(frank.contact, 'frank@jants.ca');
    });
  });

  page.form.name.suggestions(1).click();

  andThen(() => {
    // FIXME the page object field value is "" but it works via jQuery? 🤔
    assert.equal(find('md-autocomplete input').val(), 'frank');
    // assert.equal(page.form.name.value, 'frank');
    assert.equal(page.form.contact.value, 'frank@jants.ca');
    assert.equal(page.form.address.value, '91 Albert St.');
  });
});

test('ride validation errors are displayed', function(assert) {
  server.post('/rides', {
      errors: [{
        'source': {
          'pointer': '/data/attributes/name'
        },
        'detail': 'Name can\'t be blank'
      }]
    }, 422);

  page.visit();
  page.newRide();

  page.form.submit();

  andThen(() => {
    assert.equal(page.form.nameError.text, 'Name can\'t be blank');
  });
});

test('rides can be combined and uncombined, cancelling a parent ride shows a warning', function(assert) {
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 1000*60*60*24);

  server.create('ride', {name: 'A', passengers: 1, start: today, end: today});
  const parentRide = server.create('ride', {name: 'B', passengers: 1, start: today, end: today});
  server.create('ride', {name: 'C', passengers: 1, start: tomorrow, end: tomorrow});
  server.create('ride', {name: 'D', combinedWith: parentRide});

  page.visit();

  andThen(() => {
    assert.notOk(page.rides(1).date.includes(today.getFullYear()), 'expected the year to be hidden when the date is in the current year');
    assert.ok(page.rides(1).combineButton.isHidden, 'expected a ride that already has one combined with it to not a have a button to combine');
  });

  page.rides(1).cancellation.click();

  andThen(() => {
    assert.equal(page.cancellationForm.notice, 'Cancelling a ride with rides combined into it will cause the combined rides to also disappear. Uncombine them if this is undesirable.');
  });

  page.rides(0).combineButton.click();

  andThen(() => {
    assert.ok(page.rides(0).combineButton.isActive, 'expected the combine button to indicate it is active');
    assert.equal(page.rides(0).combineButton.title, 'Cancel combining');

    assert.ok(page.rides(1).combineButton.isVisible, 'expected the already-combined-with ride to be combinable-with');

    assert.notOk(page.rides(1).isUncombinable, 'expected the ride on the same day to be combinable');
    assert.ok(page.rides(2).combineButton.isHidden, 'expected a ride that has already been combined into another to not be combinable-into');
    assert.ok(page.rides(3).isUncombinable, 'expected the ride on the day before to not be combinable');
  });

  page.rides(0).combineButton.click();

  andThen(() => {
    assert.notOk(page.rides(0).combineButton.isActive, 'expected the button to have become inactive after clicking');
    assert.equal(page.rides(0).combineButton.title, 'Combine with another ride');
  });

  page.rides(0).combineButton.click();
  page.rides(3).combineButton.click();

  andThen(() => {
    assert.equal(page.rides(2).name, 'C', 'expected the combined-into ride to have moved');
    assert.equal(page.rides(3).name, 'A', 'expected the combined ride to have moved');
    assert.ok(page.rides(3).isCombined, 'expected the combined ride to show as combined');
    assert.equal(page.rides(3).combineButton.title, 'Uncombine this ride');
  });

  page.rides(3).combineButton.click();

  andThen(() => {
    assert.equal(page.rides(0).name, 'A', 'expected the formerly-combined ride to have returned');
  });
});

test('rides can be filtered by various characteristics', function(assert) {
  const stonyMountain = server.create('institution', {
    name: 'Stony Mountain'
  });

  const burnham = server.create('person', {
    name: 'Michael Burnham',
    email: 'burnham@discovery',
    landline: '111'
  });

  const lorca = server.create('person', {
    name: 'Gabriel Lorca',
    email: 'lorca@discovery'
  });

  server.create('ride', {
    enabled: false,
    name: 'Philippa Georgiou',
    address: '91 Albert',
    contact: 'jorts@example.com',
    institution: stonyMountain,

    requestNotes: 'These are some request notes.',

    driver: burnham,
    carOwner: lorca
  });

  server.create('ride', {
    name: 'Chelsea',
    start: new Date(2016, 11, 25, 10, 15),
    end: new Date(2016, 11, 25, 12, 0),
    passengers: 1,
    contact: '5145551212'
  });

  server.create('ride', {
    name: 'NEVERMATCH'
  });

  page.visit();

  andThen(() => {
    assert.equal(page.rides().count, 2, 'expected two rides to show by default');
    assert.ok(page.head.search.clear.isHidden, 'expected the empty search field to have no clear button');
  });

  page.head.search.fillIn('chel');

  andThen(() => {
    assert.equal(page.rides().count, 1, 'expected one ride to be showing after filtering');
    assert.equal(page.rides(0).name, 'Chelsea', 'expected the ride to be the Chelsea one');
    assert.ok(page.head.search.clear.isVisible, 'expected the clear button to show when the field has content');
  });

  page.head.search.clear.click();

  andThen(() => {
    assert.equal(page.rides().count, 2, 'expected the ride list to be returned to its default state');
    assert.equal(page.head.search.value, '', 'expected the search field to now be empty');
    assert.ok(page.head.search.clear.isHidden, 'expected the empty search field to have no clear button');
  });

  page.head.search.fillIn('HEL');

  andThen(() => {
    assert.equal(page.rides(0).name, 'Chelsea', 'expected the search to be case-insensitive');
  });

  page.head.search.fillIn('non-matching search');

  andThen(() => {
    assert.ok(page.noMatchesRow.isVisible, 'expected the no matches row to show with non-matching search');
  });
});
