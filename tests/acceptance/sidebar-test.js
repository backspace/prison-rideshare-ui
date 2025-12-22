import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers/application-tests';
import stringToMobiledoc from 'prison-rideshare-ui/tests/helpers/string-to-mobiledoc';
import { authenticateSession } from 'ember-simple-auth/test-support';

import rides from 'prison-rideshare-ui/tests/pages/rides';
import shared from 'prison-rideshare-ui/tests/pages/shared';

module('Acceptance | sidebar', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    this.server.create('user', { admin: true });
    await authenticateSession({ access_token: 'abcdef' });
  });

  test('the header toggle opens and closes the sidebar', async function (assert) {
    await rides.visit();

    const initialState = shared.sidebarState;

    await shared.sidebarToggle.click();
    assert.notStrictEqual(shared.sidebarState, initialState);

    await shared.sidebarToggle.click();
    assert.strictEqual(shared.sidebarState, initialState);
  });

  test('the sidebar is closed on mobile until toggled open', async function (assert) {
    assert.expect(11);

    const restoreMatchMedia = stubDesktopMatchMedia(false);

    try {
      await rides.visit();

      assert.true(
        shared.sidebar.isPresent,
        'sidebar container renders by default',
      );
      assert.strictEqual(
        shared.sidebarState,
        'closed',
        'sidebar starts closed on mobile',
      );

      const sidebarService = this.owner.lookup('service:sidebar');

      assert.false(sidebarService.open, 'sidebar service starts closed');
      assert.true(
        sidebarService.navIsMinimized,
        'sidebar service starts minimized',
      );

      await shared.sidebarToggle.click();

      assert.true(
        sidebarService.open,
        'sidebar service reports open after toggle',
      );
      assert.true(shared.sidebar.isPresent, 'sidebar renders after toggle');
      assert.strictEqual(
        shared.sidebarState,
        'open',
        'sidebar opens when toggled',
      );
      assert.true(
        shared.sidebarToggle.isPresent,
        'header toggle remains available while sidebar is open',
      );

      await shared.sidebarToggle.click();

      assert.true(
        shared.sidebar.isPresent,
        'sidebar remains rendered after closing',
      );
      assert.strictEqual(shared.sidebarState, 'closed', 'sidebar closes again');
      assert.true(
        sidebarService.navIsMinimized,
        'sidebar service reports minimized after closing',
      );
    } finally {
      restoreMatchMedia();
    }
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

    assert.strictEqual(
      shared.sidebarState,
      'closed',
      'expected the sidebar to be hidden after toggling',
    );
    assert.true(
      shared.sidebarToggleBadge.isPresent,
      'expected a badge to be shown on the toggle when notifications exist',
    );

    assert.strictEqual(shared.sidebarToggleBadge.text.trim(), '3');
  });
});

function stubDesktopMatchMedia(matches) {
  const originalMatchMedia = window.matchMedia;
  const desktopQuery = /\(min-width:\s*1088px\)/;

  window.matchMedia = (query) => {
    if (desktopQuery.test(query)) {
      return createMockMediaQueryList(matches, query);
    }

    if (typeof originalMatchMedia === 'function') {
      return originalMatchMedia(query);
    }

    return createMockMediaQueryList(true, query);
  };

  return () => {
    window.matchMedia = originalMatchMedia;
  };
}

function createMockMediaQueryList(matches, media) {
  return {
    matches,
    media,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false;
    },
  };
}
