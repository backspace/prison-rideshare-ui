import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import page from 'prison-rideshare-ui/tests/pages/login';
import shared from 'prison-rideshare-ui/tests/pages/shared';

moduleForAcceptance('Acceptance | login', {
  beforeEach() {
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

test('successful login forwards to the rides list', function(assert) {
  server.get('/users/current', ({ users }) => {
    return users.first();
  });

  page.visit();

  page.fillEmail('jorts@jants.ca');
  page.fillPassword('aaaaaaaaa');

  page.submit();

  andThen(() => {
    assert.equal(currentURL(), '/rides');
    assert.equal(shared.session.text, 'Log out jorts@jants.ca');
  });
});

test('a failure from the current endpoint logs the user out', function(assert) {
  server.get('/users/current', () => { return {}; }, 401);

  page.visit();
  page.fillEmail('x');
  page.fillPassword('x');
  page.submit();

  andThen(() => {
    assert.equal(shared.flashes(0).text, 'Please log in');
    // TODO this redirects to /reports/new but asserting that fails…
    // Also, invalidating the session means this flash message won’t even survive.
  });
});
