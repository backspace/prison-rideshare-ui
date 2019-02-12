import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers/application-tests';

import resetPage from 'prison-rideshare-ui/tests/pages/reset';
import shared from 'prison-rideshare-ui/tests/pages/shared';

module('Acceptance | reset password', function(hooks) {
  setupApplicationTest(hooks);

  test('resets a password', async function(assert) {
    let done = assert.async();

    this.server.put('/users/:token', function(
      schema,
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

      return done();
    });

    await resetPage.visit({ token: 'Strike!' });
    await resetPage.fillPassword('hello');
    await resetPage.fillPasswordConfirmation('hello');
    await resetPage.submit();

    assert.equal(shared.title, 'Reset password · Prison Rideshare');
    assert.equal(shared.toast.text, 'FIXME It worked?');
  });
});

// FIXME add error-checking
