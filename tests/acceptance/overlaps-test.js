import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import page from 'prison-rideshare-ui/tests/pages/rides';
import shared from 'prison-rideshare-ui/tests/pages/shared';

import moment from 'moment';

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
  let slot = server.create('slot');
  this.firstRide.createCommitment({ slot, person });
  this.firstRide.save();

  page.visit();

  andThen(() => {
    assert.equal(shared.overlapCount.text, '1');

    assert.ok(page.rides[0].isOverlapping, 'expected the overlapping ride to be highlighted');
    assert.equal(page.rides[0].overlapButton.text, 'date_range Assign Octavia Butler');
  });

  page.rides[0].overlapButton.click();

  andThen(() => {
    assert.equal(page.rides[0].driver.text, 'Octavia Butler');
    assert.equal(page.rides[0].carOwner.text, 'Octavia Butler');

    let [serverRide] = server.db.rides;

    assert.equal(serverRide.driverId, person.id);
    assert.equal(serverRide.carOwnerId, person.id);
  });
});

test('no badge is displayed when there are no overlaps', function(assert) {
  page.visit();

  andThen(() => {
    assert.ok(shared.overlapCount.isHidden);
  });
});
