import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import page from 'prison-rideshare-ui/tests/pages/login';
import nav from 'prison-rideshare-ui/tests/pages/nav';

moduleForAcceptance('Acceptance | login', {
});

test('successful login forwards to the rides list', function(assert) {
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

  server.get('/users/current', ({ users }) => {
    return users.first();
  });

  page.visit();

  page.fillEmail('jorts@jants.ca');
  page.fillPassword('aaaaaaaaa');

  page.submit();

  andThen(() => {
    assert.equal(currentURL(), '/rides');
    assert.equal(nav.session.text, 'Log out jorts@jants.ca');
  });
});
