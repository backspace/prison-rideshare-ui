import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import page from 'prison-rideshare-ui/tests/pages/users';
import loginPage from 'prison-rideshare-ui/tests/pages/login';
import shared from 'prison-rideshare-ui/tests/pages/shared';

moduleForAcceptance('Acceptance | users', {
  beforeEach() {
    this.admin = server.create('user', {
      email: 'abc@def.com',
      admin: true
    });

    this.nonAdmin = server.create('user', {
      email: 'ghi@jkl.com',
      admin: false
    });
  }
});

test('list users and update admin status', function(assert) {
  authenticateSession(this.application);

  page.visit();

  andThen(function() {
    assert.equal(shared.title, 'Users · Prison Rideshare');

    assert.equal(page.users().count, 2, 'expected two users');

    assert.equal(page.users(0).email, 'abc@def.com');
    assert.ok(page.users(0).adminCheckbox.checked);

    assert.equal(page.users(1).email, 'ghi@jkl.com');
    assert.notOk(page.users(1).adminCheckbox.checked);
  });

  page.users(1).adminCheckbox.click();

  andThen(function() {
    assert.ok(page.users(1).adminCheckbox.checked);

    const serverUsers = server.db.users;
    const lastUser = serverUsers[serverUsers.length - 1];
    assert.ok(lastUser.admin);
  });
});

test('shows who is present', function(assert) {
  server.post('/token', schema => {
    authenticateSession(this.application, {access_token: 'abcdef'});

    // FIXME another repetition… how to log in as admin???
    schema.create('user', {
      email: 'jorts@jants.ca',
      password: 'aaaaaaaaa'
    });

    return {
      access_token: 'abcdef'
    };
  });

  loginPage.visit();
  loginPage.fillEmail('jorts@jants.ca');
  loginPage.fillPassword('aaaaaaaaa');
  loginPage.submit();

  page.visit();

  const userSocket = this.application.__container__.lookup('service:user-socket');

  andThen(() => {
    assert.ok(shared.userCount.isHidden, 'expected no user count to show when no one is connected');

    // TODO why does this have to go inside the andThen?
    const presenceStateMessage = {};
    presenceStateMessage[`User:${this.admin.id}`] = {};
    userSocket._onPresenceState(presenceStateMessage);

    const joinPresenceDiffMessage = {joins: {}, leaves: {}};
    joinPresenceDiffMessage.joins[`User:${this.nonAdmin.id}`] = {};
    userSocket._onPresenceDiff(joinPresenceDiffMessage);
  });

  andThen(() => {
    assert.equal(shared.userCount.text, '2', 'expected the count to show when two people are connected');
    assert.ok(page.users(0).isPresent, 'expected the admin to be marked as present');
    assert.ok(page.users(1).isPresent, 'expected the non-admin to be marked as present');

    const leavePresenceDiffMessage = {joins: {}, leaves: {}};
    leavePresenceDiffMessage.leaves[`User:${this.nonAdmin.id}`] = {};
    userSocket._onPresenceDiff(leavePresenceDiffMessage);
  });

  andThen(() => {
    assert.ok(shared.userCount.isHidden, 'expected no user count to show when only one person is connected');
    assert.notOk(page.users(1).isPresent, 'expected the non-admin to be not marked as present');

    const rejoinPresenceDiffMessage = {joins: {}, leaves: {}};
    rejoinPresenceDiffMessage.joins[`User:${this.admin.id}`] = {};
    userSocket._onPresenceDiff(rejoinPresenceDiffMessage);
  });

  andThen(() => {
    assert.ok(shared.userCount.isHidden, 'expected the count to not include duplicates');
  });
});
