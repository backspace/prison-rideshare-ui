/* eslint-disable qunit/require-expect */
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers/application-tests';
import { Response } from 'miragejs';
import percySnapshot from '@percy/ember';
import { authenticateSession } from 'ember-simple-auth/test-support';

import page from 'prison-rideshare-ui/tests/pages/register';
import shared from 'prison-rideshare-ui/tests/pages/shared';

module('Acceptance | registration', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    // FIXME this is duplicated here and in login-test because it needs access to the application
    // which seems impossible from mirage/config
    this.server.post('/token', (schema) => {
      authenticateSession({ access_token: 'abcdef' });

      // FIXME yeah…
      schema.create('user', {
        email: 'jorts@jants.ca',
        password: 'aaaaaaaaa',
      });

      return {
        access_token: 'abcdef',
      };
    });
  });

  test('registrations are sent to the server, currently with no followup', async function (assert) {
    this.server.post('/register', 'users');

    await page.visit();

    await page.fillEmail('jorts@jants.ca');
    await page.fillPassword('aaaaaaaaa');
    await page.fillPasswordConfirmation('aaaaaaaaa');

    await page.submit();

    const [user] = this.server.db.users;

    assert.strictEqual(user.email, 'jorts@jants.ca');
    assert.strictEqual(user.password, 'aaaaaaaaa');

    assert.strictEqual(shared.session.text, 'Log out jorts@jants.ca');
  });

  test('a failed registration shows an unprocessed error', async function (assert) {
    this.server.post('/register', () => {
      return new Response(
        422,
        {},
        {
          errors: [
            {
              source: {
                pointer: '/data/attributes/password-confirmation',
              },
              detail: 'Password confirmation did not match',
            },
          ],
        },
      );
    });

    await page.visit();

    await page.fillEmail('jorts@jants.ca');
    await page.fillPassword('aaaaaaaaa');
    await page.fillPasswordConfirmation('aaaaaaaaa');

    await page.submit();

    await percySnapshot(assert);

    assert.strictEqual(currentURL(), '/register');
    assert.strictEqual(
      shared.inlineAlert.text,
      'Password confirmation did not match',
    );
  });
});
