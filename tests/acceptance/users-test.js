import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import page from 'prison-rideshare-ui/tests/pages/users';

moduleForAcceptance('Acceptance | reports', {
  beforeEach() {
    server.create('user', {
      email: 'abc@def.com',
      admin: true
    });

    server.create('user', {
      email: 'ghi@jkl.com',
      admin: false
    });

    authenticateSession(this.application);
  }
});

test('list users', function(assert) {
  page.visit();

  andThen(function() {
    assert.equal(page.users().count, 2, 'expected two users');

    assert.equal(page.users(0).email, 'abc@def.com');
    assert.ok(page.users(0).adminCheckbox.checked);

    assert.equal(page.users(1).email, 'ghi@jkl.com');
    assert.notOk(page.users(1).adminCheckbox.checked);
  });
});
