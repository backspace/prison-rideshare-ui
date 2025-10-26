import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers/application-tests';
import stringToMobiledoc from 'prison-rideshare-ui/tests/helpers/string-to-mobiledoc';
import { authenticateSession } from 'ember-simple-auth/test-support';

import shared from 'prison-rideshare-ui/tests/pages/shared';

module('Acceptance | sidebar', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    this.server.create('user', { admin: true });
    await authenticateSession({ access_token: 'abcdef' });
  });

  test('the header toggle opens and closes the sidebar', async function (assert) {
    await visit('/rides');

    const initialVisibility = shared.sidebar.isPresent;

    await shared.sidebarToggle.click();
    assert.notStrictEqual(shared.sidebar.isPresent, initialVisibility);

    await shared.sidebarToggle.click();
    assert.strictEqual(shared.sidebar.isPresent, initialVisibility);
  });

  test('a badge is shown on the toggle when notifications exist and the sidebar is closed', async function (assert) {
    this.server.create('post', {
      content: stringToMobiledoc('hello'),
      poster: this.server.create('user'),
      unread: true,
      insertedAt: new Date(2018, 6, 6, 14),
    });

    const week = 7 * 24 * 60 * 60 * 1000;
    const nowMilliseconds = new Date().getTime();
    const nextWeek = new Date(nowMilliseconds + week);

    this.server.create('ride', {
      start: nextWeek,
      end: nextWeek,
      medium: 'phone',
      requestConfirmed: false,
    });

    this.firstRide = this.server.create('ride', {
      name: 'Visitor',
      contact: '555-1919',
      address: '91 alb',
      start: new Date(2117, 11, 4, 17, 0),
      end: new Date(2117, 11, 4, 30),
    });

    let person = this.server.create('person', { name: 'Octavia Butler' });
    let slot = this.server.create('slot', {
      start: new Date(2117, 11, 4, 17, 30),
      end: new Date(2117, 11, 4, 20),
    });

    this.firstRide.createCommitment({ slot, person });
    this.firstRide.save();

    await visit('/rides');
    await shared.sidebarToggle.click();

    assert.false(
      shared.sidebar.isPresent,
      'expected the sidebar to be hidden after toggling',
    );
    assert.true(
      shared.sidebarToggleBadge.isPresent,
      'expected a badge to be shown on the toggle when notifications exist',
    );

    assert.strictEqual(shared.sidebarToggleBadge.text.trim(), '3');
  });
});
