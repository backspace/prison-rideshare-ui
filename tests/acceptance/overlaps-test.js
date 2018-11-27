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

test('overlaps display a count badge in the sidebar', function(assert) {
  server.get('/rides/overlaps', function({ rides }) {
    return rides.all();
  });

  page.visit();

  andThen(() => {
    assert.equal(shared.overlapCount.text, '1');
  });
});

test('no badge is displayed when there are no overlaps', function(assert) {
  server.get('/rides/overlaps', function({ rides }) {
    return rides.none();
  });

  page.visit();

  andThen(() => {
    assert.ok(shared.overlapCount.isHidden);
  });
})
