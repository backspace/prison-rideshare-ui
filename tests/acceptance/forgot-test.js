/* eslint-disable qunit/require-expect */
import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers/application-tests';
import percySnapshot from '@percy/ember';
import { Response } from 'miragejs';

import { getPageTitle } from 'ember-page-title/test-support';
import forgotPage from 'prison-rideshare-ui/tests/pages/forgot';
import shared from 'prison-rideshare-ui/tests/pages/shared';

module('Acceptance | forgot', function (hooks) {
  setupApplicationTest(hooks);

  test('triggers a reset email', async function (assert) {
    let done = assert.async();

    this.server.post(
      '/users/reset',
      function (schema, { queryParams: { email } }) {
        assert.strictEqual(email, 'hello@example.com');

        return done();
      },
    );

    await forgotPage.visit();

    await percySnapshot(assert);

    await forgotPage.fillEmail('hello@example.com');
    await forgotPage.submit();

    assert.strictEqual(getPageTitle(), 'Forgot password · Prison Rideshare');
    assert.strictEqual(shared.toast.text, 'Check your email');
  });

  test('a reset email failure shows an alert until it succeeds', async function (assert) {
    let shouldFail = true;

    this.server.post('/users/reset', () => {
      if (shouldFail) {
        return new Response(
          500,
          {},
          {
            errors: [
              {
                detail: 'nope',
              },
            ],
          },
        );
      }

      return {};
    });

    await forgotPage.visit();
    await forgotPage.fillEmail('hello@example.com');
    await forgotPage.submit();

    assert.strictEqual(shared.inlineAlert.text, 'nope');

    shouldFail = false;
    await forgotPage.submit();

    assert.notOk(shared.inlineAlert.isPresent);
  });
});
