import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import page from 'prison-rideshare-ui/tests/pages/register';

moduleForAcceptance('Acceptance | registration', {
});

test('registrations are sent to the server, currently with no followup', function(assert) {
  server.post('/register', 'users');

  page.visit();

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
