/* eslint-disable qunit/require-expect */
import { currentURL, waitUntil } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers/application-tests';
import { Response } from 'miragejs';
import { overrideRoute } from '../helpers/override-route';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { percySnapshot } from 'ember-percy';
import { pollTaskFor } from 'ember-lifeline/test-support';

import page from 'prison-rideshare-ui/tests/pages/calendar';
import shared from 'prison-rideshare-ui/tests/pages/shared';
import { POLL_TOKEN } from 'prison-rideshare-ui/routes/calendar';

module('Acceptance | calendar', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    const person = this.server.create('person', {
      name: 'Jortle Tortle',
      email: 'jorts@jants.ca',
      mobile: '5551313',
      medium: 'mobile',
      active: true,
      magicToken: 'MAGIC??TOKEN',
      accessToken: 'XXX',
      calendarSecret: 'SECRET++',
      selfNotes: 'My self notes',
      address: '91 Albert',
    });
    this.person = person;

    this.server.create('person', {
      name: 'Non-committal',
      active: true,
    });

    this.server.create('person', {
      name: 'Also non-committal',
      active: true,
    });

    const committedSlot = this.server.create('slot', {
      start: new Date(2117, 11, 4, 17, 30),
      end: new Date(2117, 11, 4, 20),
      count: 1,
    });

    this.toCommitSlot = this.server.create('slot', {
      start: new Date(2117, 11, 10, 17),
      end: new Date(2117, 11, 10, 21),
      count: 2,
    });

    this.server.create('slot', {
      start: new Date(2117, 11, 10, 11),
      end: new Date(2117, 11, 10, 17),
      count: 0,
    });

    committedSlot.createCommitment({
      person: this.server.create('person', { name: 'Other Slot Person' }),
    });
    committedSlot.createCommitment({ person });

    const fullyCommittedSlot = this.server.create('slot', {
      start: new Date(2117, 11, 14, 17, 30),
      end: new Date(2117, 11, 14, 20),
      count: 1,
    });

    fullyCommittedSlot.createCommitment({
      person: this.server.create('person', {
        name: 'Fully Committed Slot Person',
      }),
    });

    this.server.create('slot', {
      start: new Date(2017, 11, 10, 11),
      end: new Date(2017, 11, 10, 17),
      count: 0,
    });

    const pastCommittedSlot = this.server.create('slot', {
      start: new Date(2017, 11, 11, 11),
      end: new Date(2017, 11, 11, 17),
      count: 0,
    });

    pastCommittedSlot.createCommitment({ person });
  });

  test('calendar shows existing commitments and lets them be changed', async function (assert) {
    await page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

    assert.strictEqual(page.personSession, 'Logged in as jorts@jants.ca');
    assert.strictEqual(page.month, 'December 2117');

    page.days[3].as((d4) => {
      assert.strictEqual(d4.slots.length, 1, 'expected one slot on Monday');
      d4.slots[0].as((s1) => {
        assert.strictEqual(s1.hours, '5:30p—8');
        assert.ok(s1.isCommittedTo, 'expected the slot to be committed-to');
        assert.notOk(s1.isDisabled, 'expected the slot to not be full');
        assert.notOk(
          s1.count.isVisible,
          'expected the slot count not to show for a non-admin',
        );
      });
    });

    page.days[9].as((d10) => {
      assert.strictEqual(d10.slots.length, 2, 'expected two slots on Sunday');
      d10.slots[0].as((s1) => {
        assert.strictEqual(s1.hours, '11a—5p');
        assert.notOk(
          s1.isCommittedTo,
          'expected the slot to not be committed-to',
        );
      });
      d10.slots[1].as((s2) => {
        assert.strictEqual(s2.hours, '5p—9');
      });
    });

    await page.days[3].slots[0].click();

    assert.strictEqual(
      shared.toast.text,
      'Cancelled your agreement to drive on December 4',
    );
    assert.notOk(
      page.days[3].slots[0].isCommittedTo,
      'expected the slot to not longer be committed-to',
    );
    assert.strictEqual(
      this.server.db.commitments.length,
      3,
      'expected the commitment to have been deleted on the server',
    );
    percySnapshot(assert);
  });

  test('slots can be committed to', async function (assert) {
    let authorizationHeader;

    this.server.post('/commitments', function (schema, request) {
      authorizationHeader = request.requestHeaders.Authorization;
      let attrs = this.normalizedRequestAttrs();
      return schema.commitments.create(attrs);
    });

    await page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

    // FIXME this is only a separate test because toasts linger forever in the test environment
    await page.days[9].slots[1].click();

    assert.strictEqual(
      shared.toast.text,
      'Thanks for agreeing to drive on December 10!',
    );
    assert.ok(
      page.days[9].slots[1].isCommittedTo,
      'expected the slot to be newly committed-to',
    );

    const [, , , , commitment] = this.server.db.commitments;
    assert.strictEqual(
      commitment.slotId,
      this.toCommitSlot.id,
      'expected the server to have the newly-created commitment',
    );

    assert.strictEqual(
      authorizationHeader,
      'Person Bearer XXX',
      'expected the person token to be sent when creating a commitment',
    );
  });

  test('slots are polled so remote commitments show up', async function (assert) {
    await page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

    assert.ok(page.days[9].slots[1].isVisible);

    this.toCommitSlot.createCommitment();
    this.toCommitSlot.createCommitment();

    await pollTaskFor(POLL_TOKEN);

    assert.ok(
      page.days[9].slots[1].isHidden,
      'expected the remotely-filled slot to have disappeared',
    );
  });

  test('full and committed-to slots show as such and full slots from others are hidden', async function (assert) {
    this.server.post('/commitments', function () {
      assert.ok(false, 'expected no commitment to be created for a full slot');
    });

    this.toCommitSlot.createCommitment();
    this.toCommitSlot.createCommitment();

    await page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

    assert.ok(
      page.days[9].slots[1].isHidden,
      'expected the full slot to be hidden',
    );
  });

  test('past slots can’t be committed to', async function (assert) {
    this.server.post('/commitments', function () {
      assert.ok(false, 'expected no commitment to be created for a past slot');
    });

    await page.visit({ month: '2017-12', token: 'MAGIC??TOKEN' });

    assert.ok(
      page.days[9].slots[0].isDisabled,
      'expected the past slot to be disabled',
    );
    assert.ok(
      page.days[10].slots[0].isCommittedTo,
      'expected the past committed slot to show as committed-to',
    );
    assert.ok(
      page.days[10].slots[0].isDisabled,
      'expected the past committed slot to be disabled',
    );

    assert.rejects(page.days[9].slots[0].click());

    assert.notOk(
      page.days[9].slots[0].isCommittedTo,
      'expected the slot to not be committed-to',
    );
  });

  test('a failure to delete a commitment keeps it displayed and shows an error', async function (assert) {
    const restoreCommitmentDelete = overrideRoute(
      this.server,
      'delete',
      '/commitments/:id',
      function () {
        return new Response(
          401,
          {},
          {
            errors: [
              {
                status: 401,
                title: 'Unauthorized',
              },
            ],
          },
        );
      },
    );

    await page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

    await page.days[3].slots[0].click();

    assert.strictEqual(shared.inlineAlert.text, 'Couldn’t save your change');
    assert.ok(
      page.days[3].slots[0].isCommittedTo,
      'expected the slot to still be committed-to',
    );
    assert.strictEqual(
      this.server.db.commitments.length,
      4,
      'expected the commitment to still be on the server',
    );

    restoreCommitmentDelete();

    await page.days[3].slots[0].click();

    assert.notOk(shared.inlineAlert.isPresent);
  });

  test('a failure to create a commitment makes it not display and shows an error', async function (assert) {
    const restoreCommitmentCreate = overrideRoute(
      this.server,
      'post',
      '/commitments',
      function () {
        return new Response(
          401,
          {},
          {
            errors: [
              {
                status: 401,
                title: 'Unauthorized',
              },
            ],
          },
        );
      },
    );

    await page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

    await page.days[9].slots[1].click();

    assert.strictEqual(shared.inlineAlert.text, 'Couldn’t save your change');
    assert.notOk(
      page.days[9].slots[1].isCommittedTo,
      'expected the slot to not be committed-to',
    );
    assert.strictEqual(
      this.server.db.commitments.length,
      4,
      'expected the commitments to be unchanged on the server',
    );

    restoreCommitmentCreate();

    await page.days[9].slots[1].click();
    assert.notOk(shared.inlineAlert.isPresent);
  });

  test('a failure to create a commitment with a particular error shows the error', async function (assert) {
    overrideRoute(this.server, 'post', '/commitments', function () {
      return new Response(
        422,
        {},
        {
          errors: [
            {
              status: 422,
              title: 'Unauthorized',
              detail: 'Fail!',
            },
          ],
        },
      );
    });

    await page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

    await page.days[9].slots[1].click();
    assert.strictEqual(shared.inlineAlert.text, 'Fail!');
  });

  test('visiting with an unknown magic token shows an error', async function (assert) {
    await page.visit({ month: '2117-12', token: 'JORTLEBY' });

    assert.strictEqual(
      page.error,
      'We were unable to log you in with that token.',
    );
  });

  test('visiting with no token shows an error', async function (assert) {
    await page.visit({ month: '2117-12' });

    assert.strictEqual(
      page.error,
      'We were unable to log you in without a token.',
    );
  });

  test('visiting with a magic token that doesn’t resolve to a person shows an error', async function (assert) {
    this.server.get('/people/me', function () {
      return new Response(
        401,
        {},
        {
          errors: [
            {
              status: 401,
              title: 'Unauthorized',
            },
          ],
        },
      );
    });

    await page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

    assert.strictEqual(
      page.error,
      'We were unable to log you in with that token.',
    );
  });

  test('visiting with a rejected magic token shows an error including details', async function (assert) {
    this.server.post('/people/token', function () {
      return new Response(
        401,
        {},
        {
          errors: [
            {
              status: 401,
              title: 'Unauthorized',
              detail: 'A detail',
            },
          ],
        },
      );
    });

    await page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

    assert.strictEqual(page.error, 'A detail');
  });

  test('the person can edit their details', async function (assert) {
    await page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

    assert.ok(
      page.person.name.isHidden,
      'expected the name field to be hidden by default',
    );

    await page.person.toggle.click();

    assert.ok(
      page.person.name.isVisible,
      'expected the name field to have become visible',
    );
    assert.strictEqual(page.person.name.field.value, 'Jortle Tortle');

    assert.ok(
      page.person.activeSwitch.enabled,
      'expected the active switch to be on',
    );

    assert.ok(
      page.person.email.field.isDisabled,
      'expected the email field to be disabled',
    );
    assert.strictEqual(page.person.email.field.value, 'jorts@jants.ca');

    assert.ok(
      page.person.mobile.desiredMedium.isChecked,
      'expected mobile to be the desired medium',
    );

    assert.strictEqual(page.person.selfNotes.value, 'My self notes');
    assert.strictEqual(page.person.address.value, '91 Albert');

    assert.notOk(
      page.person.submitButton.isHighlighted,
      'expected the submit button to not be highlighted before anything has changed',
    );

    await page.person.name.field.fillIn('Jartle');
    await page.person.cancelButton.click();

    assert.ok(
      page.person.name.isHidden,
      'expected the form to be hidden again',
    );

    await page.person.toggle.click();

    assert.strictEqual(
      page.person.name.field.value,
      'Jortle Tortle',
      'expected the change to have been reverted',
    );

    await page.person.name.field.fillIn('Jortleby');
    await page.person.activeSwitch.click();
    await page.person.mobile.field.fillIn('1234');
    await page.person.email.desiredMedium.click();
    await page.person.selfNotes.fillIn('Updated self notes');
    await page.person.address.fillIn('A new address');

    assert.ok(
      page.person.submitButton.isHighlighted,
      'expected the submit button to be highlighted when the record is dirty',
    );

    percySnapshot(assert);
    await page.person.submitButton.click();

    const [person] = this.server.db.people;

    assert.strictEqual(
      person.name,
      'Jortleby',
      'expected the name to have changed on the server',
    );
    assert.notOk(
      person.active,
      'expected the person to be inactive on the server',
    );
    assert.strictEqual(
      person.mobile,
      '1234',
      'expected the mobile number to have changed on the server',
    );
    assert.strictEqual(
      person.medium,
      'email',
      'expected the medium to have changed on the server',
    );
    assert.strictEqual(
      person.selfNotes,
      'Updated self notes',
      'expected the self notes to have changed on the server',
    );
    assert.strictEqual(person.address, 'A new address');

    assert.strictEqual(shared.toast.text, 'Saved your details');

    assert.ok(
      page.person.name.isHidden,
      'expected the form to be hidden again',
    );

    await page.person.toggle.click();

    assert.notOk(
      page.person.name.isError,
      'expected the name field to not show as being invalid',
    );
  });

  test('the person can get a link to subscribe to their calendar', async function (assert) {
    await page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

    assert.ok(
      page.subscription.link.href.endsWith(
        `/people/${this.person.id}/calendar?secret=SECRET%2B%2B`,
      ),
      'expected the calendar URL to have the encoded secret',
    );
  });

  test('shows detail validation errors', async function (assert) {
    await page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

    await page.person.toggle.click();
    await page.person.name.field.fillIn('');
    await page.person.submitButton.click();

    assert.strictEqual(shared.inlineAlert.text, 'Couldn’t save your details');
    assert.strictEqual(page.person.name.error.text, "Name can't be blank");
    assert.ok(
      page.person.name.field.isError,
      'expected the name field to show as being invalid',
    );

    await page.person.name.field.fillIn('Jortleby');
    await page.person.submitButton.click();

    assert.notOk(
      shared.inlineAlert.isPresent,
      'expected the inline alert to clear after fixing validation issues',
    );
  });

  test('handles an error saving details', async function (assert) {
    await page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

    const restorePeopleMe = overrideRoute(
      this.server,
      'patch',
      '/people/me',
      function () {
        return new Response(
          401,
          {},
          {
            errors: [
              {
                status: 401,
                title: 'Unauthorized',
              },
            ],
          },
        );
      },
    );

    await page.person.toggle.click();
    await page.person.name.field.fillIn('Jartleby');
    await page.person.submitButton.click();

    assert.strictEqual(shared.inlineAlert.text, 'Couldn’t save your details');
    assert.ok(
      page.person.name.isVisible,
      'expected the form to still be visible',
    );

    restorePeopleMe();

    await page.person.submitButton.click();

    assert.notOk(
      shared.inlineAlert.isPresent,
      'expected the inline alert to clear after retrying the save',
    );
  });

  test('the path controls the month', async function (assert) {
    await page.visit({ month: '2118-01', token: 'MAGIC??TOKEN' });

    assert.strictEqual(page.month, 'January 2118');
  });

  test('an admin can see the commitments with person names', async function (assert) {
    this.server.create('user', { admin: true });
    await authenticateSession({ access_token: 'abcdef' });
    await page.adminVisit({ month: '2117-12' });

    assert.strictEqual(
      page.days[3].slots[0].count.text,
      '2/1',
      'expected two people to show for the slot out of a maximum of one',
    );
    assert.ok(
      page.days[3].slots[0].count.isCommittedTo,
      'expected the two person-slot to show as committed to',
    );
    assert.ok(
      page.days[3].slots[0].checkbox.isHidden,
      'expected the checkbox to not display',
    );

    assert.ok(
      page.days[13].slots[0].isVisible,
      'expected a full slot to show in admin mode',
    );

    assert.strictEqual(
      page.people.length,
      0,
      'expected no people details to show initially',
    );

    assert.strictEqual(
      page.days[9].slots[0].count.text,
      '0/∞',
      'expected the slot capacity to show as ∞',
    );
    assert.notOk(
      page.days[9].slots[0].count.isCommittedTo,
      'expected the empty slot to not show as committed to',
    );

    await page.days[3].slots[0].count.click();

    assert.strictEqual(page.viewingSlot, 'Saturday, December 4, 5:30p–8:00p');
    assert.strictEqual(
      page.people.length,
      2,
      'expected two people details to show for the slot',
    );
    assert.strictEqual(page.people[0].name, 'Other Slot Person');
    assert.strictEqual(page.people[1].name, 'Jortle Tortle');

    await page.people[1].reveal();

    assert.strictEqual(
      page.people[1].email,
      'jorts@jants.ca',
      'expected the contact information to be revealed',
    );

    percySnapshot(assert);

    await page.nextMonth.click();

    assert.strictEqual(page.month, 'January 2118: 0 commitments');
    assert.ok(
      currentURL().endsWith('2118-01'),
      'expected the path to have changed with the new month',
    );

    await page.previousMonth.click();

    assert.strictEqual(page.month, 'December 2117: 3 commitments');
    assert.ok(
      currentURL().endsWith('2117-12'),
      'expected the path to have returned to the original month',
    );
  });

  test('an admin can create commitments', async function (assert) {
    this.server.create('user', { admin: true });
    await authenticateSession({ access_token: 'abcdef' });
    await page.adminVisit({ month: '2117-12' });

    await page.days[9].slots[1].count.click();
    await page.peopleSearch.fillIn('commit');

    assert.strictEqual(
      page.peopleSearch.options.length,
      3,
      'expected three people to show for possible commitments',
    );
    assert.strictEqual(page.peopleSearch.options[0].text, 'Also non-committal');
    assert.strictEqual(
      page.peopleSearch.options[1].text,
      'Fully Committed Slot Person',
    );
    assert.strictEqual(page.peopleSearch.options[2].text, 'Non-committal');

    await page.peopleSearch.fillIn('also');

    assert.strictEqual(
      page.peopleSearch.options.length,
      1,
      'expected only one match',
    );

    await page.peopleSearch.options[0].click();

    assert.strictEqual(
      shared.toast.text,
      'Committed Also non-committal to drive on December 10',
    );
    assert.strictEqual(
      page.days[9].slots[1].count.text,
      '1/2',
      'expected the slot to be newly committed-to',
    );

    const [, , , , commitment] = this.server.db.commitments;
    assert.strictEqual(
      commitment.slotId,
      this.toCommitSlot.id,
      'expected the server to have the newly-created commitment',
    );

    await page.peopleSearch.fillIn('commit');

    assert.strictEqual(
      page.peopleSearch.options.length,
      2,
      'expected the now-commited person to not show in the search',
    );
  });

  test('an error when an admin tries to create a commitment is displayed', async function (assert) {
    const restoreAdminCommitmentCreate = overrideRoute(
      this.server,
      'post',
      '/commitments',
      function () {
        return new Response(
          422,
          {},
          {
            errors: [
              {
                status: 422,
                title: 'Unauthorized',
                detail: 'Fail!',
              },
            ],
          },
        );
      },
    );

    this.server.create('user', { admin: true });
    await authenticateSession({ access_token: 'abcdef' });
    await page.adminVisit({ month: '2117-12' });

    await page.days[9].slots[1].count.click();
    await page.peopleSearch.fillIn('also');
    await waitUntil(() => page.peopleSearch.options.length);
    await page.peopleSearch.options[0].click();

    assert.strictEqual(shared.inlineAlert.text, 'Fail!');
    assert.strictEqual(
      this.server.db.commitments.length,
      4,
      'expected no change on the server',
    );

    restoreAdminCommitmentCreate();

    await page.days[9].slots[0].count.click();
    await page.peopleSearch.fillIn('also');
    await waitUntil(() => page.peopleSearch.options.length);
    await page.peopleSearch.options[0].click();

    assert.notOk(
      shared.inlineAlert.isPresent,
      'expected the inline alert to clear after the admin commitment succeeds',
    );
  });

  test('an admin can delete commitments', async function (assert) {
    this.server.create('user', { admin: true });
    await authenticateSession({ access_token: 'abcdef' });
    await page.adminVisit({ month: '2117-12' });

    await page.days[3].slots[0].count.click();
    await page.people[0].remove();

    assert.strictEqual(
      shared.toast.text,
      'Deleted Other Slot Person’s commitment on December 4',
    );
    assert.strictEqual(
      this.server.db.commitments.length,
      3,
      'expected there to be three commitments left on the server',
    );
  });

  test('an error when an admin tries to delete a commitment is displayed', async function (assert) {
    const restoreAdminCommitmentDelete = overrideRoute(
      this.server,
      'delete',
      '/commitments/:id',
      function () {
        return new Response(
          422,
          {},
          {
            errors: [
              {
                status: 422,
                title: 'Unauthorized',
                detail: 'Fail!',
              },
            ],
          },
        );
      },
    );

    this.server.create('user', { admin: true });
    await authenticateSession({ access_token: 'abcdef' });
    await page.adminVisit({ month: '2117-12' });

    await page.days[3].slots[0].count.click();
    await page.people[0].remove();

    assert.strictEqual(shared.inlineAlert.text, 'Fail!');
    assert.strictEqual(
      this.server.db.commitments.length,
      4,
      'expected no change on the server',
    );

    restoreAdminCommitmentDelete();

    await page.people[1].remove();
    assert.notOk(shared.inlineAlert.isPresent);
  });
});
