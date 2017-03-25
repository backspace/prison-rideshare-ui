import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | authentication', {
});

test('authenticated users are redirected to the rides list', function(assert) {
  authenticateSession(this.application);
  visit('/');
  andThen(() => assert.equal(currentURL(), '/rides'));
});

test('unauthenticated users are redirected to the report form', function(assert) {
  visit('/');
  andThen(() => assert.equal(currentURL(), '/reports/new'));
});
