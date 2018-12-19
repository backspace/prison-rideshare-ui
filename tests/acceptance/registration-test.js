import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers/application-tests';
import Mirage from 'ember-cli-mirage';

import { authenticateSession } from 'ember-simple-auth/test-support';

import page from 'prison-rideshare-ui/tests/pages/register';
import shared from 'prison-rideshare-ui/tests/pages/shared';

module('Acceptance | registration', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    // FIXME this is duplicated here and in login-test because it needs access to the application
    // which seems impossible from mirage/config
    this.server.post('/token', schema => {
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

  test('registrations are sent to the server, currently with no followup', async function(assert) {
    this.server.post('/register', 'users');

    await page.visit();

    await page.fillEmail('jorts@jants.ca');
    await page.fillPassword('aaaaaaaaa');
    await page.fillPasswordConfirmation('aaaaaaaaa');

    await page.submit();

    const [user] = this.server.db.users;

    assert.equal(user.email, 'jorts@jants.ca');
    assert.equal(user.password, 'aaaaaaaaa');

    assert.equal(shared.session.text, 'Log out jorts@jants.ca');
  });

  test('a failed registration shows an unprocessed error', async function(assert) {
    this.server.post('/register', () => {
      return new Mirage.Response(
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
        }
      );
    });

    await page.visit();

    await page.fillEmail('jorts@jants.ca');
    await page.fillPassword('aaaaaaaaa');
    await page.fillPasswordConfirmation('aaaaaaaaa');

    await page.submit();

    assert.equal(currentURL(), '/register');
    assert.equal(page.error, 'Password confirmation did not match');
  });
});
