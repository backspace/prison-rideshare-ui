import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers/application-tests';
import { percySnapshot } from 'ember-percy';

import { authenticateSession } from 'ember-simple-auth/test-support';

import page from 'prison-rideshare-ui/tests/pages/login';
import shared from 'prison-rideshare-ui/tests/pages/shared';

module('Acceptance | login', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.server.post('/token', (schema, { requestBody }) => {
      authenticateSession({ access_token: 'abcdef' });

      // FIXME yeah… weird to create the user here!

      if (requestBody.includes('jorts')) {
        schema.create('user', {
          email: 'jorts@jants.ca',
          password: 'aaaaaaaaa',
          admin: true,
        });
      } else if (requestBody.includes('jj')) {
        schema.create('user', {
          email: 'jj@jj.ca',
          password: 'aaaaaaaaa',
        });
      }

      return {
        access_token: 'abcdef',
      };
    });
  });

  test('successful admin login forwards to the rides list', async function(assert) {
    await page.visit();

    await page.fillEmail('jorts@jants.ca');
    await page.fillPassword('aaaaaaaaa');

    await page.submit();

    assert.equal(currentURL(), '/rides');
    assert.equal(shared.session.text, 'Log out jorts@jants.ca');
  });

  test('successful non-admin login forwards to the report route', async function(assert) {
    await page.visit();

    await page.fillEmail('jj@jj.ca');
    await page.fillPassword('aaaaaaaaa');
    await page.submit();

    assert.equal(currentURL(), '/reports/new');
  });

  test('a failure from the current endpoint logs the user out', async function(assert) {
    this.server.get(
      '/users/current',
      () => {
        return {};
      },
      401
    );

    await page.visit();
    await page.fillEmail('x');
    await page.fillPassword('x');
    await page.submit();

    assert.equal(shared.toast.text, 'Please log in');
    // TODO this redirects to /reports/new but asserting that fails…
    // Also, invalidating the session means this toast won’t even survive.
  });

  test('a failed login shows an error', async function(assert) {
    this.server.post(
      '/token',
      () => {
        return {};
      },
      401
    );

    await page.visit();
    await page.fillEmail('x');
    await page.submit();

    percySnapshot(assert);

    assert.equal(currentURL(), '/login');
    assert.equal(page.error, 'There was an error logging you in.');
  });
});
