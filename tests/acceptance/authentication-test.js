import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import shared from 'prison-rideshare-ui/tests/pages/shared';

moduleForAcceptance('Acceptance | authentication', {});

test('authenticated users are redirected to the report form after logging out', function(assert) {
  authenticateSession(this.application);
  visit('/rides');
  shared.session.click();

  andThen(() =>
    assert.ok(
      shared.session.isHidden,
      'expected the sidebar to show not being logged in'
    )
  );
});

test('unauthenticated users are redirected to the report form', function(assert) {
  visit('/');
  andThen(() => assert.equal(currentURL(), '/reports/new'));
});

test('unauthenticated users are redirected to log in from authenticated routes', assert => {
  visit('/debts');
  andThen(() => assert.equal(currentURL(), '/login'));
});
