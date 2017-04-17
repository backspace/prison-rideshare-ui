import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import page from 'prison-rideshare-ui/tests/pages/register';
import shared from 'prison-rideshare-ui/tests/pages/shared';

moduleForAcceptance('Acceptance | registration', {
  beforeEach() {
    // FIXME this is duplicated here and in login-test because it needs access to the application
    // which seems impossible from mirage/config
    server.post('/token', schema => {
      authenticateSession(this.application, {access_token: 'abcdef'});

      // FIXME yeah…
      schema.create('user', {
        email: 'jorts@jants.ca',
        password: 'aaaaaaaaa'
      });

      return {
        access_token: 'abcdef'
      };
    });
  }
});

test('registrations are sent to the server, currently with no followup', function(assert) {
  server.post('/register', 'users');

  page.visit();

  andThen(() => assert.equal(shared.title, 'Register · Prison Rideshare'));

  page.fillEmail('jorts@jants.ca');
  page.fillPassword('aaaaaaaaa');
  page.fillPasswordConfirmation('aaaaaaaaa');

  page.submit();

  andThen(() => {
    const [user] = server.db.users;

    assert.equal(user.email, 'jorts@jants.ca');
    assert.equal(user.password, 'aaaaaaaaa');

    assert.equal(shared.session.text, 'Log out jorts@jants.ca');
  });
});
