/* eslint-disable qunit/require-expect */
import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers/application-tests';
import { currentURL } from '@ember/test-helpers';
import percySnapshot from '@percy/ember';
import { Response } from 'miragejs';
import { overrideRoute } from '../helpers/override-route';

import resetPage from 'prison-rideshare-ui/tests/pages/reset';
import shared from 'prison-rideshare-ui/tests/pages/shared';
import { getPageTitle } from 'ember-page-title/test-support';

module('Acceptance | reset password', function (hooks) {
  setupApplicationTest(hooks);

  test('resets a password and logs the user in', async function (assert) {
    this.server.create('user', {
      email: 'test@example.com',
    });

    let resetDone = false,
      loginDone = false;

    this.server.put(
      '/users/:token',
      function ({ users }, { params: { token }, requestBody }) {
        let {
          data: {
            attributes: { password, 'password-confirmation': confirmation },
          },
        } = JSON.parse(requestBody);

        assert.strictEqual(token, 'Strike!');

        assert.strictEqual(password, 'hello');
        assert.strictEqual(confirmation, 'hello');

        resetDone = true;

        return users.first();
      },
    );

    this.server.post('/token', () => {
      loginDone = true;

      return {
        access_token: 'abcdef',
      };
    });

    await resetPage.visit({ token: 'Strike!' });
    assert.strictEqual(getPageTitle(), 'Reset password · Prison Rideshare');
    await resetPage.fillPassword('hello');
    await resetPage.fillPasswordConfirmation('hello');
    await resetPage.submit();

    assert.strictEqual(
      shared.toast.text,
      'Changed your password, will now log you in',
    );
    assert.strictEqual(currentURL(), '/reports/new');

    assert.ok(resetDone);
    assert.ok(loginDone);
  });

  test('a validation error is displayed', async function (assert) {
    const restoreResetRoute = overrideRoute(
      this.server,
      'put',
      '/users/:token',
      () =>
        new Response(
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
        ),
    );

    await resetPage.visit({ token: 'hey' });
    await resetPage.fillPassword('x');
    await resetPage.submit();

    await percySnapshot(assert);

    assert.strictEqual(
      shared.inlineAlert.text,
      'Password confirmation did not match',
    );

    this.server.create('user', { email: 'validation@test.com' });
    this.server.post('/token', () => {
      return {
        access_token: 'abcdef',
      };
    });
    restoreResetRoute(({ users }) => users.first());

    await resetPage.fillPassword('hello');
    await resetPage.fillPasswordConfirmation('hello');
    await resetPage.submit();

    assert.notOk(shared.inlineAlert.isPresent);
  });

  test('an unknown error is handled', async function (assert) {
    this.server.put('/users/:token', () => {
      return new Response(500, {}, {});
    });

    await resetPage.visit({ token: 'hey' });
    await resetPage.fillPassword('x');
    await resetPage.submit();

    assert.strictEqual(shared.inlineAlert.text, 'An unknown error occurred');
  });
});
