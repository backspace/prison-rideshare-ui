import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import page from 'prison-rideshare-ui/tests/pages/login';
// import nav from 'prison-rideshare-ui/tests/pages/nav';

moduleForAcceptance('Acceptance | login', {
});

test('successful login forwards to the rides list', function(assert) {
  server.post('/token', () => {
    authenticateSession(this.application);

    return {
      access_token: 'abcdef'
    };
  });

  page.visit();

  page.fillEmail('jorts@jants.ca');
  page.fillPassword('aaaaaaaaa');

  page.submit();

  andThen(() => {
    assert.equal(currentURL(), '/rides');
    // assert.equal(nav.session, 'Log out testuser@example.com');
  });
});
