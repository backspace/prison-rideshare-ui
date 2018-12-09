import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import page from 'prison-rideshare-ui/tests/pages/rides';
import shared from 'prison-rideshare-ui/tests/pages/shared';

import moment from 'moment';
import Mirage from 'ember-cli-mirage';

moduleForAcceptance('Acceptance | overlaps', {
  beforeEach() {
    server.create('user', { admin: true });
    authenticateSession(this.application, { access_token: 'abcdef' });

    this.firstRide = server.create('ride', {
      start: moment().add(1, 'week'),
      end: moment().add(1, 'week')
    });
  }
});

test('overlaps display a count badge in the sidebar and overlapping rides can be assigned to the driver', function(assert) {
  let person = server.create('person', { name: 'Octavia Butler' });
  let slot = server.create('slot', {
    start: new Date(2117, 11, 4, 17, 30),
    end: new Date(2117, 11, 4, 20),
  });

  let commitment = this.firstRide.createCommitment({ slot, person });
  this.firstRide.save();

  page.visit();

  andThen(() => {
    assert.equal(shared.overlapCount.text, '1');

    assert.ok(page.rides[0].isOverlapping, 'expected the overlapping ride to be highlighted');
    assert.equal(page.overlaps[0].text, 'Octavia Butler committed to slot 5:30p—8');

    // Delete the commitment in an andThen in anticipation of the button being clicked
    commitment.destroy();
    this.firstRide.save();
  });

  page.overlaps[0].assign();

  andThen(() => {
    assert.equal(page.rides[0].driver.text, 'Octavia Butler');
    assert.equal(page.rides[0].carOwner.text, 'Octavia Butler');

    let [serverRide] = server.db.rides;

    assert.equal(serverRide.driverId, person.id);
    assert.equal(serverRide.carOwnerId, person.id);

    assert.ok(shared.overlapCount.isHidden);
    assert.notOk(page.rides[0].isOverlapping, 'expected the ride to no longer be overlapping');
  });
});

test('creating a ride triggers a check for overlaps', function(assert) {
  let person = server.create('person', { name: 'Octavia Butler' });
  let slot = server.create('slot');
  server.create('commitment', { slot, person });

  server.post('/rides', function({ commitments, rides }) {
    let attrs = this.normalizedRequestAttrs();
    let ride = rides.create(attrs);
    ride.commitments = commitments.all();
    ride.save();

    return ride;
  });

  server.create('institution', {
    name: 'Rockwood'
  });

  page.visit();
  page.newRide();
  page.form.timespan.fillIn('Dec 26 2016 from 9a to 11:30');
  selectChoose('md-input-container.institution', 'Rockwood');

  page.form.submit();

  andThen(function() {
    assert.equal(shared.overlapCount.text, '1');
    assert.ok(page.rides[0].isOverlapping, 'expected the overlapping ride to be highlighted');
  });
});

test('an overlap can be ignored', function(assert) {
  let person = server.create('person', { name: 'Octavia Butler' });
  let slot = server.create('slot', {
    start: new Date(2117, 11, 4, 17, 30),
    end: new Date(2117, 11, 4, 20),
  });

  let commitment = this.firstRide.createCommitment({ slot, person });
  this.firstRide.save();

  server.post('/rides/:ride_id/ignore/:commitment_id', (schema, { params: { ride_id, commitment_id }}) => {
    assert.equal(ride_id, this.firstRide.id);
    assert.equal(commitment_id, commitment.id);

    this.firstRide.commitments = [];
    this.firstRide.save();

    return new Mirage.Response(201, {}, {});
  });

  page.visit();
  page.overlaps[0].ignore();

  andThen(() => {
    assert.ok(shared.overlapCount.isHidden);
    assert.notOk(page.rides[0].isOverlapping, 'expected the ride to no longer be overlapping');
  });
});

test('no badge is displayed when there are no overlaps', function(assert) {
  page.visit();

  andThen(() => {
    assert.ok(shared.overlapCount.isHidden);
  });
});
