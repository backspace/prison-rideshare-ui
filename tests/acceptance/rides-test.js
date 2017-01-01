import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import page from 'prison-rideshare-ui/tests/pages/rides';

import moment from 'moment';

moduleForAcceptance('Acceptance | rides');

test('list existing rides with sortability', function(assert) {
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

    name: 'Edward',
    address: '91 Albert',
    contact: 'jorts@example.com',
    passengers: 3,
    institution: leavenworth,

    driver: sun,
    carOwner: lito
  });

  server.create('ride', {
    name: 'Chelsea',
    start: new Date(2016, 11, 25, 10, 15),
    end: new Date(2016, 11, 25, 12, 0),
    passengers: 1
  });

  page.visit();

  andThen(function() {
    const ride = page.rides(0);

    assert.notOk(ride.enabled, 'expected the later ride to not be enabled');
    assert.notOk(ride.switch.enabled, 'expected the switch to not be enabled');
    assert.equal(ride.name, 'Edward + 2');
    assert.equal(ride.date, '2016-12-26 8:30pm — 10:00');
    assert.equal(ride.institution, 'Fort Leavenworth');
    assert.equal(ride.address, '91 Albert');
    assert.equal(ride.contact, 'jorts@example.com');

    assert.equal(ride.driver, 'Sun');
    assert.equal(ride.carOwner, 'Lito');

    assert.ok(page.rides(1).enabled, 'expected the other ride to be enabled');
    assert.equal(page.rides(1).name, 'Chelsea', 'expected the earlier ride to be sorted to the bottom');
  });

  page.rides().head.clickDate();

  andThen(function() {
    assert.equal(page.rides(0).name, 'Chelsea', 'expected the earlier ride to be sorted to the top');
  });

  page.rides(1).switch.click();

  andThen(() => {
    const ride = page.rides(0);
    assert.ok(ride.enabled, 'expected the later ride to have become enabled');
    assert.ok(ride.switch.enabled, 'expected the switch to have become enabled');
  });
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

  page.visit();
  page.newRide();

  andThen(() => {
    assert.equal(page.rides().count, 0, 'there should be no row for an unsaved ride');
  });

  page.form.fillDate('2016-12-26');
  page.form.fillStart('09:00');
  page.form.fillEnd('11:30');

  page.form.fillName('Edward');
  page.form.fillAddress('114 Spence');
  page.form.fillContact('jants@example.com');
  page.form.fillPassengers(2);

  // FIXME not really here, but keyboard input for this is broken, and hovering
  selectChoose('md-input-container.institution', 'Rockwood');
  selectChoose('md-input-container.driver', 'Sun');
  selectChoose('md-input-container.car-owner', 'Sun');

  page.form.submit();

  andThen(function() {
    const ride = page.rides(0);
    assert.equal(ride.name, 'Edward + 1');

    assert.equal(ride.date, '2016-12-26 9:00am — 11:30');

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
    assert.equal(lastRide.driverId, sun.id);
    assert.equal(lastRide.carOwnerId, sun.id);

    assert.equal(currentURL(), '/rides');
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
