import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import page from 'prison-rideshare-ui/tests/pages/register';
import shared from 'prison-rideshare-ui/tests/pages/shared';

moduleForAcceptance('Acceptance | registration', {
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
  });
});
