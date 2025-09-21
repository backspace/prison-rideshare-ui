/* eslint-disable qunit/require-expect */
import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers/application-tests';
import { percySnapshot } from 'ember-percy';

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
        assert.equal(email, 'hello');

        return done();
      }
    );

    await forgotPage.visit();

    percySnapshot(assert);

    await forgotPage.fillEmail('hello');
    await forgotPage.submit();

    assert.equal(getPageTitle(), 'Forgot password · Prison Rideshare');
    assert.equal(shared.toast.text, 'Check your email');
  });
});
