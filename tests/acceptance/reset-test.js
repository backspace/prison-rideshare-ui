import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers/application-tests';
import { currentURL } from '@ember/test-helpers';
import Mirage from 'ember-cli-mirage';

import resetPage from 'prison-rideshare-ui/tests/pages/reset';
import shared from 'prison-rideshare-ui/tests/pages/shared';

module('Acceptance | reset password', function(hooks) {
  setupApplicationTest(hooks);

  test('resets a password and logs the user in', async function(assert) {
    this.server.create('user', {
      email: 'test@example.com',
    });

    let resetDone = false,
      loginDone = false;

    this.server.put('/users/:token', function(
      { users },
      { params: { token }, requestBody }
    ) {
      let {
        data: {
          attributes: { password, 'password-confirmation': confirmation },
        },
      } = JSON.parse(requestBody);

      assert.equal(token, 'Strike!');

      assert.equal(password, 'hello');
      assert.equal(confirmation, 'hello');

      resetDone = true;

      return users.first();
    });

    this.server.post('/token', () => {
      loginDone = true;

      return {
        access_token: 'abcdef',
      };
    });

    await resetPage.visit({ token: 'Strike!' });
    assert.equal(shared.title, 'Reset password · Prison Rideshare');

    await resetPage.fillPassword('hello');
    await resetPage.fillPasswordConfirmation('hello');
    await resetPage.submit();

    assert.equal(shared.toast.text, 'FIXME It worked?');
    assert.equal(currentURL(), '/reports/new');

    assert.ok(resetDone);
    assert.ok(loginDone);
  });

  test('a validation error is displayed', async function(assert) {
    this.server.put('/users/:token', () => {
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

    await resetPage.visit({ token: 'hey' });
    await resetPage.fillPassword('x');
    await resetPage.submit();

    assert.equal(shared.toast.text, 'Password confirmation did not match');
  });

  test('an unknown error is handled', async function(assert) {
    this.server.put('/users/:token', () => {
      return new Mirage.Response(500, {}, {});
    });

    await resetPage.visit({ token: 'hey' });
    await resetPage.fillPassword('x');
    await resetPage.submit();

    assert.equal(shared.toast.text, 'An unknown error occurred');
  });
});
