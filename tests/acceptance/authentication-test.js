import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers/application-tests';

import { authenticateSession } from 'ember-simple-auth/test-support';

import shared from 'prison-rideshare-ui/tests/pages/shared';

module('Acceptance | authentication', function (hooks) {
  setupApplicationTest(hooks);

  test('authenticated users are redirected to the report form after logging out', async function (assert) {
    await authenticateSession();
    await visit('/rides');
    await shared.session.click();

    assert.ok(
      shared.session.isHidden,
      'expected the sidebar to show not being logged in'
    );
  });

  test('unauthenticated users are redirected to the report form', async function (assert) {
    this.server.create('ride');

    await visit('/');

    assert.equal(currentURL(), '/reports/new');
  });

  test('unauthenticated users are redirected to log in from authenticated routes', async function (assert) {
    await visit('/debts');
    assert.equal(currentURL(), '/login');
  });
});
