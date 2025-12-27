/* eslint-disable qunit/require-expect */
import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers/application-tests';
import percySnapshot from '@percy/ember';
import { authenticateSession } from 'ember-simple-auth/test-support';

import page from 'prison-rideshare-ui/tests/pages/rides';
import shared from 'prison-rideshare-ui/tests/pages/shared';

import { Response } from 'miragejs';

module('Acceptance | overlaps', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    this.server.create('user', { admin: true });
    await authenticateSession({ access_token: 'abcdef' });

    this.firstRide = this.server.create('ride', {
      name: 'Visitor',
      contact: '555-1919',
      address: '91 alb',
      start: new Date(2117, 11, 4, 17, 0),
      end: new Date(2117, 11, 4, 30),
    });
  });

  test('overlaps display a count badge in the sidebar and overlapping rides can be assigned to the driver', async function (assert) {
    let person = this.server.create('person', { name: 'Octavia Butler' });
    let slot = this.server.create('slot', {
      start: new Date(2117, 11, 4, 17, 30),
      end: new Date(2117, 11, 4, 20),
    });

    let commitment = this.firstRide.createCommitment({ slot, person });
    this.firstRide.save();

    await page.visit();

    percySnapshot(assert);

    assert.strictEqual(shared.ridesBadge.text, '1');

    assert.ok(
      page.rides[0].isHighlighted,
      'expected the overlapping ride to be highlighted',
    );
    assert.strictEqual(
      page.overlaps[0].text,
      'Octavia Butler committed to slot 5:30p—8',
    );

    commitment.destroy();
    this.firstRide.save();

    await page.overlaps[0].assign();

    assert.strictEqual(page.rides[0].driver.text, 'Octavia Butler');
    assert.strictEqual(page.rides[0].carOwner.text, 'Octavia Butler');

    let [serverRide] = this.server.db.rides;

    assert.strictEqual(serverRide.driverId, person.id);
    assert.strictEqual(serverRide.carOwnerId, person.id);

    assert.ok(shared.ridesBadge.isHidden);
    assert.notOk(
      page.rides[0].isHighlighted,
      'expected the ride to no longer be overlapping',
    );
  });

  test('creating a ride triggers a check for overlaps', async function (assert) {
    let person = this.server.create('person', { name: 'Octavia Butler' });
    let slot = this.server.create('slot');
    this.server.create('commitment', { slot, person });

    this.server.post('/rides', function ({ commitments, rides }) {
      let attrs = this.normalizedRequestAttrs();
      let ride = rides.create(attrs);
      ride.commitments = commitments.all();
      ride.save();

      return ride;
    });

    this.server.create('institution', {
      name: 'Rockwood',
    });

    await page.visit();
    await page.newRide();
    await page.form.timespan.fillIn('yesterday at 1am to tomorrow at 11pm');

    await page.form.submit();

    assert.strictEqual(shared.ridesBadge.text, '1');
    assert.ok(
      page.rides[0].isHighlighted,
      'expected the overlapping ride to be highlighted',
    );
  });

  test('an overlap can be ignored', async function (assert) {
    let person = this.server.create('person', { name: 'Octavia Butler' });
    let slot = this.server.create('slot', {
      start: new Date(2117, 11, 4, 17, 30),
      end: new Date(2117, 11, 4, 20),
    });

    let commitment = this.firstRide.createCommitment({ slot, person });
    this.firstRide.save();

    this.server.post(
      '/rides/:ride_id/ignore/:commitment_id',
      (schema, { params: { ride_id, commitment_id } }) => {
        assert.strictEqual(ride_id, this.firstRide.id);
        assert.strictEqual(commitment_id, commitment.id);

        this.firstRide.commitments = [];
        this.firstRide.save();

        return new Response(201, {}, {});
      },
    );

    await page.visit();
    await page.overlaps[0].ignore();

    assert.ok(shared.ridesBadge.isHidden);
    assert.notOk(
      page.rides[0].isHighlighted,
      'expected the ride to no longer be overlapping',
    );
  });

  test('no badge is displayed when there are no overlaps', async function (assert) {
    await page.visit();

    assert.ok(shared.ridesBadge.isHidden);
  });
});
