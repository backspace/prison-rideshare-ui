import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import page from 'prison-rideshare-ui/tests/pages/rides';

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
    name: 'Sun'
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
    institution: leavenworth,

    driver: sun,
    carOwner: lito
  });

  const chelseaRide = server.create('ride', {
    name: 'Chelsea',
    start: new Date(2016, 11, 25, 10, 15),
    end: new Date(2016, 11, 25, 12, 0),
    passengers: 1
  });

  chelseaRide.createChild({
    combinedWith: chelseaRide,
    name: 'Visitor'
  });

  page.visit();

  andThen(() => {
    assert.equal(page.rides().count, 2, 'expected the cancelled ride to be hidden');
    assert.notOk(page.head.cancelledSwitch.enabled, 'expected the cancelled switch to be off');
  });

  page.head.cancelledSwitch.click();

  andThen(function() {
    assert.equal(page.rides().count, 3, 'expected the cancelled ride to be shown');

    const ride = page.rides(0);

    assert.notOk(ride.enabled, 'expected the later ride to not be enabled');
    assert.ok(ride.cancellation.showsLockdown, 'expected the cancelled ride to show lockdown for the reason');
    assert.equal(ride.name, 'Edward + 2');
    assert.equal(ride.date, 'Mon Dec 26 8:30pm — 10:00');
    assert.equal(ride.institution, 'Fort Leavenworth');
    assert.equal(ride.address, '91 Albert');
    assert.equal(ride.contact, 'jorts@example.com');

    assert.equal(ride.driver.text, 'Sun');
    assert.equal(ride.carOwner.text, 'Lito');
  });

  page.rides(0).edit();
  andThen(() => assert.equal(page.form.notice, 'You are editing a cancelled ride!'));
  page.form.cancel();

  andThen(() => {
    assert.ok(page.rides(1).enabled, 'expected the other ride to be enabled');
    assert.ok(page.rides(1).cancellation.showsNotCancelled, 'expected the other ride to not be cancelled');
    assert.equal(page.rides(1).name, 'Chelsea', 'expected the earlier ride to be sorted to the bottom');

    assert.ok(page.rides(2).name, 'Visitor', 'expected the combined ride to be beneath its parent');
    assert.ok(page.rides(2).isCombined, 'expected the combined ride to show it is combined');
  });

  page.rides().head.clickDate();

  andThen(function() {
    assert.equal(page.rides(0).name, 'Chelsea', 'expected the earlier ride to be sorted to the top');
  });

  page.rides(2).cancellation.click();

  andThen(function() {
    assert.ok(page.cancellationForm.cancelled.checked, 'expected the cancellation box to be checked');
    assert.equal(page.cancellationForm.reason.value, 'lockdown');
  });

  selectChoose('md-input-container.reason', 'visitor');
  page.cancellationForm.save();

  andThen(function() {
    assert.ok(page.rides(2).cancellation.showsVisitor, 'expected the ride to now be cancelled by the visitor');
  });

  page.rides(2).cancellation.click();
  page.cancellationForm.cancelled.click();
  page.cancellationForm.save();

  andThen(function() {
    assert.ok(page.rides(2).enabled, 'expected the ride to no longer be cancelled');
    assert.ok(page.rides(2).cancellation.showsNotCancelled, 'expected the other ride to not be cancelled');
    assert.notOk(page.rides(2).cancellation.showsVisitor, 'expected the ride to not show the visitor as a reason');
    assert.notOk(page.rides(2).cancellation.showsLockdown, 'expected the ride not show lockdown as a reason');
  });
});

test('completed rides can be shown', function(assert) {
  server.create('ride');
  server.create('ride');
  server.create('ride', {
    distance: 44
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
  });

  page.rides(0).edit();
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

    assert.equal(page.form.passengersValue, '1', 'the form should default to one passenger');
  });

  page.form.fillDate('2016-12-26');
  page.form.fillStart('09:00');
  page.form.fillEnd('11:30');

  page.form.fillName('Edward');
  page.form.fillAddress('114 Spence');
  page.form.fillContact('jants@example.com');
  page.form.fillPassengers(2);

  page.form.fillNotes('Some request notes?');

  // FIXME not really here, but keyboard input for this is broken, and hovering
  selectChoose('md-input-container.institution', 'Rockwood');

  page.form.submit();

  andThen(function() {
    const ride = page.rides(0);
    assert.equal(ride.name, 'Edward + 1');

    assert.equal(ride.date, 'Mon Dec 26 9:00am — 11:30');

    assert.equal(ride.institution, 'Rockwood');

    const serverRides = server.db.rides;
    const lastRide = serverRides[serverRides.length - 1];

    assert.equal(lastRide.name, 'Edward');
    assert.equal(moment(lastRide.start).format('YYYY-MM-DD HH:mm'), '2016-12-26 09:00');
    assert.equal(moment(lastRide.end).format('YYYY-MM-DD HH:mm'), '2016-12-26 11:30');
    assert.equal(lastRide.address, '114 Spence');
    assert.equal(lastRide.contact, 'jants@example.com');
    assert.equal(lastRide.passengers, 2);
    assert.equal(lastRide.institutionId, rockwood.id);
    assert.equal(lastRide.requestNotes, 'Some request notes?');
  });

  page.rides(0).driver.click();
  selectChoose('.driver md-input-container', 'Sun');

  andThen(function() {
    assert.equal(page.rides(0).driver.text, 'Sun');
    assert.equal(page.rides(0).carOwner.text, 'Sun', 'expected the car owner to be set automatically');

    const serverRides = server.db.rides;
    const lastRide = serverRides[serverRides.length - 1];

    assert.equal(lastRide.driverId, sun.id);
    assert.equal(lastRide.carOwnerId, sun.id);
  });

  page.rides(0).carOwner.click();
  selectChoose('.car-owner md-input-container', 'Lito');

  andThen(function() {
    assert.equal(page.rides(0).carOwner.text, 'Lito');

    const serverRides = server.db.rides;
    const lastRide = serverRides[serverRides.length - 1];

    assert.equal(lastRide.carOwnerId, lito.id);
  });

  page.rides(0).edit();

  page.form.fillName('Ed');
  page.form.cancel();

  andThen(function() {
    assert.equal(page.rides(0).name, 'Edward + 1');

    const serverRides = server.db.rides;
    const lastRide = serverRides[serverRides.length - 1];
    assert.equal(lastRide.name, 'Edward');
  });

  page.rides(0).edit();

  page.form.fillName('Edwina');

  andThen(() => {
    assert.equal(page.rides(0).name, 'Edward + 1', 'expected the original model to not yet have changed');
  });

  page.form.submit();

  andThen(function() {
    assert.equal(page.rides(0).name, 'Edwina + 1');

    const serverRides = server.db.rides;
    const lastRide = serverRides[serverRides.length - 1];
    assert.equal(lastRide.name, 'Edwina');
  });
});

test('rides can be combined', function(assert) {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 1000*60*60*24);

  server.create('ride', {name: 'A', passengers: 1, start: today, end: today});
  server.create('ride', {name: 'B', passengers: 1, start: today, end: today});
  server.create('ride', {name: 'C', passengers: 1, start: yesterday, end: yesterday});

  page.visit();

  page.rides(0).combine();
  page.rides(2).combine();

  andThen(() => {
    assert.equal(page.rides(1).name, 'C', 'expected the combined-into ride to have moved');
    assert.equal(page.rides(2).name, 'A', 'expected the combined ride to have moved');
    assert.ok(page.rides(2).isCombined, 'expected the combined ride to show as combined');
  });
});
