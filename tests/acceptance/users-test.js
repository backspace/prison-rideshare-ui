import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers/application-tests';
import { percySnapshot } from 'ember-percy';

import { authenticateSession } from 'ember-simple-auth/test-support';

import page from 'prison-rideshare-ui/tests/pages/users';
import loginPage from 'prison-rideshare-ui/tests/pages/login';
import shared from 'prison-rideshare-ui/tests/pages/shared';

module('Acceptance | users', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    this.admin = this.server.create('user', {
      email: 'abc@def.com',
      admin: true,
      lastSeenAt: new Date(2018, 6, 6, 14),
    });

    this.nonAdmin = this.server.create('user', {
      email: 'ghi@jkl.com',
      admin: false,
    });

    this.server.post('/token', () => {
      authenticateSession({ access_token: 'abcdef' });

      return {
        access_token: 'abcdef',
      };
    });

    await loginPage.visit();
    await loginPage.fillEmail('jorts@jants.ca');
    await loginPage.fillPassword('aaaaaaaaa');
    await loginPage.submit();
  });

  test('list users and update admin status', async function (assert) {
    await page.visit();

    assert.equal(shared.title, 'Users · Prison Rideshare');

    assert.equal(page.users.length, 2, 'expected two users');

    assert.equal(page.users[0].email, 'abc@def.com');
    assert.equal(page.users[0].lastSeenAt, 'Jul 6 2018');
    assert.ok(page.users[0].adminCheckbox.checked);
    assert.ok(page.users[0].adminCheckbox.isDisabled);

    assert.equal(page.users[1].email, 'ghi@jkl.com');
    assert.notOk(page.users[1].adminCheckbox.checked);

    await page.users[1].adminCheckbox.click();

    assert.ok(page.users[1].adminCheckbox.checked);

    const serverUsers = this.server.db.users;
    const lastUser = serverUsers[serverUsers.length - 1];
    assert.ok(lastUser.admin);
  });

  test('shows who is present', async function (assert) {
    await page.visit();

    const userSocket = this.owner.lookup('service:user-socket');

    assert.ok(
      shared.userCount.isHidden,
      'expected no user count to show when no one is connected'
    );

    const presenceStateMessage = {};
    presenceStateMessage[`User:${this.admin.id}`] = {};
    userSocket._onPresenceState(presenceStateMessage);

    const joinPresenceDiffMessage = { joins: {}, leaves: {} };
    joinPresenceDiffMessage.joins[`User:${this.nonAdmin.id}`] = {};
    userSocket._onPresenceDiff(joinPresenceDiffMessage);

    await page.visit();

    assert.equal(
      shared.userCount.text,
      '2',
      'expected the count to show when two people are connected'
    );
    assert.ok(
      page.users[0].isPresent,
      'expected the admin to be marked as present'
    );
    assert.ok(
      page.users[1].isPresent,
      'expected the non-admin to be marked as present'
    );

    percySnapshot(assert);

    const leavePresenceDiffMessage = { joins: {}, leaves: {} };
    leavePresenceDiffMessage.leaves[`User:${this.nonAdmin.id}`] = {};
    userSocket._onPresenceDiff(leavePresenceDiffMessage);

    await page.visit();

    assert.ok(
      shared.userCount.isHidden,
      'expected no user count to show when only one person is connected'
    );
    assert.notOk(
      page.users[1].isPresent,
      'expected the non-admin to be not marked as present'
    );

    const rejoinPresenceDiffMessage = { joins: {}, leaves: {} };
    rejoinPresenceDiffMessage.joins[`User:${this.admin.id}`] = {};
    userSocket._onPresenceDiff(rejoinPresenceDiffMessage);
    assert.ok(
      shared.userCount.isHidden,
      'expected the count to not include duplicates'
    );
  });
});
