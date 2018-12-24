import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers/application-tests';

import resetPage from 'prison-rideshare-ui/tests/pages/reset';
import shared from 'prison-rideshare-ui/tests/pages/shared';

module('Acceptance | reset', function(hooks) {
  setupApplicationTest(hooks);

  test('triggers a reset email', async function(assert) {
    let done = assert.async();

    this.server.post('/users/reset', function(
      schema,
      { queryParams: { email } }
    ) {
      assert.equal(email, 'hello');

      return done();
    });

    await resetPage.visit();
    await resetPage.fillEmail('hello');
    await resetPage.submit();

    assert.equal(shared.title, 'Forgot password · Prison Rideshare');
    assert.equal(shared.toast.text, 'Check your email');
  });
});
