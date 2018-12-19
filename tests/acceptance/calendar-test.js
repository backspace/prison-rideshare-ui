import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers/application-tests';
import Mirage from 'ember-cli-mirage';
import { authenticateSession } from 'ember-simple-auth/test-support';

import page from 'prison-rideshare-ui/tests/pages/calendar';
import shared from 'prison-rideshare-ui/tests/pages/shared';

module('Acceptance | calendar', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
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
      count: 3,
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

  test('calendar shows existing commitments and lets them be changed', async function(assert) {
    await page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

    assert.equal(page.personSession, 'Logged in as jorts@jants.ca');
    assert.equal(page.month, 'December 2117');

    page.days[3].as(d4 => {
      assert.equal(d4.slots.length, 1, 'expected one slot on Monday');
      d4.slots[0].as(s1 => {
        assert.equal(s1.hours, '5:30p—8');
        assert.ok(s1.isCommittedTo, 'expected the slot to be committed-to');
        assert.notOk(s1.isDisabled, 'expected the slot to not be full');
        assert.notOk(
          s1.count.isVisible,
          'expected the slot count not to show for a non-admin'
        );
      });
    });

    page.days[9].as(d10 => {
      assert.equal(d10.slots.length, 2, 'expected two slots on Sunday');
      d10.slots[0].as(s1 => {
        assert.equal(s1.hours, '11a—5p');
        assert.notOk(
          s1.isCommittedTo,
          'expected the slot to not be committed-to'
        );
      });
      d10.slots[1].as(s2 => {
        assert.equal(s2.hours, '5p—9');
      });
    });

    await page.days[3].slots[0].click();

    assert.equal(
      shared.toast.text,
      'Cancelled your agreement to drive on December 4'
    );
    assert.notOk(
      page.days[3].slots[0].isCommittedTo,
      'expected the slot to not longer be committed-to'
    );
    assert.equal(
      this.server.db.commitments.length,
      2,
      'expected the commitment to have been deleted on the server'
    );
  });

  test('slots can be committed to', async function(assert) {
    await page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

    // FIXME this is only a separate test because toasts linger forever in the test environment
    await page.days[9].slots[1].click();

    assert.equal(
      shared.toast.text,
      'Thanks for agreeing to drive on December 10!'
    );
    assert.ok(
      page.days[9].slots[1].isCommittedTo,
      'expected the slot to be newly committed-to'
    );

    const [, , , commitment] = this.server.db.commitments;
    assert.equal(
      commitment.slotId,
      this.toCommitSlot.id,
      'expected the server to have the newly-created commitment'
    );
  });

  test('full slots show as full and can’t be committed to', async function(assert) {
    this.server.post('/commitments', function() {
      assert.ok(false, 'expected no commitment to be created for a full slot');
    });

    this.toCommitSlot.createCommitment();
    this.toCommitSlot.createCommitment();

    await page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

    assert.ok(
      page.days[9].slots[1].isDisabled,
      'expected the full slot to be disabled'
    );

    await page.days[9].slots[1].click();

    assert.notOk(
      page.days[9].slots[1].isCommittedTo,
      'expected the slot to not be committed-to'
    );
  });

  test('past slots can’t be committed to', async function(assert) {
    this.server.post('/commitments', function() {
      assert.ok(false, 'expected no commitment to be created for a past slot');
    });

    await page.visit({ month: '2017-12', token: 'MAGIC??TOKEN' });

    assert.ok(
      page.days[9].slots[0].isDisabled,
      'expected the past slot to be disabled'
    );
    assert.ok(
      page.days[10].slots[0].isCommittedTo,
      'expected the past committed slot to show as committed-to'
    );
    assert.ok(
      page.days[10].slots[0].isDisabled,
      'expected the past committed slot to be disabled'
    );

    await page.days[9].slots[0].click();

    assert.notOk(
      page.days[9].slots[0].isCommittedTo,
      'expected the slot to not be committed-to'
    );
  });

  test('a failure to delete a commitment keeps it displayed and shows an error', async function(assert) {
    this.server.delete('/commitments/:id', function() {
      return new Mirage.Response(
        401,
        {},
        {
          errors: [
            {
              status: 401,
              title: 'Unauthorized',
            },
          ],
        }
      );
    });

    await page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

    await page.days[3].slots[0].click();

    assert.equal(shared.toast.text, 'Couldn’t save your change');
    assert.ok(
      page.days[3].slots[0].isCommittedTo,
      'expected the slot to still be committed-to'
    );
    assert.equal(
      this.server.db.commitments.length,
      3,
      'expected the commitment to still be on the server'
    );
  });

  test('a failure to create a commitment makes it not display and shows an error', async function(assert) {
    this.server.post('/commitments', function() {
      return new Mirage.Response(
        401,
        {},
        {
          errors: [
            {
              status: 401,
              title: 'Unauthorized',
            },
          ],
        }
      );
    });

    await page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

    await page.days[9].slots[1].click();

    assert.equal(shared.toast.text, 'Couldn’t save your change');
    assert.notOk(
      page.days[9].slots[1].isCommittedTo,
      'expected the slot to not be committed-to'
    );
    assert.equal(
      this.server.db.commitments.length,
      3,
      'expected the commitments to be unchanged on the server'
    );
  });

  test('a failure to create a commitment with a particular error shows the error', async function(assert) {
    this.server.post('/commitments', function() {
      return new Mirage.Response(
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
        }
      );
    });

    await page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

    await page.days[9].slots[1].click();

    assert.equal(shared.toast.text, 'Fail!');
  });

  test('visiting with an unknown magic token shows an error', async function(assert) {
    await page.visit({ month: '2117-12', token: 'JORTLEBY' });

    assert.equal(page.error, 'We were unable to log you in with that token.');
  });

  test('visiting with no token shows an error', async function(assert) {
    await page.visit({ month: '2117-12' });

    assert.equal(page.error, 'We were unable to log you in without a token.');
  });

  test('visiting with a magic token that doesn’t resolve to a person shows an error', async function(assert) {
    this.server.get('/people/me', function() {
      return new Mirage.Response(
        401,
        {},
        {
          errors: [
            {
              status: 401,
              title: 'Unauthorized',
            },
          ],
        }
      );
    });

    await page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

    assert.equal(page.error, 'We were unable to log you in with that token.');
  });

  test('the person can edit their details', async function(assert) {
    await page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

    assert.ok(
      page.person.name.isHidden,
      'expected the name field to be hidden by default'
    );

    await page.person.toggle.click();

    assert.ok(
      page.person.name.isVisible,
      'expected the name field to have become visible'
    );
    assert.equal(page.person.name.field.value, 'Jortle Tortle');

    assert.ok(
      page.person.activeSwitch.enabled,
      'expected the active switch to be on'
    );

    assert.ok(
      page.person.email.field.isDisabled,
      'expected the email field to be disabled'
    );
    assert.equal(page.person.email.field.value, 'jorts@jants.ca');

    assert.ok(
      page.person.mobile.desiredMedium,
      'expected mobile to be the desired medium'
    );

    assert.equal(page.person.selfNotes.field.value, 'My self notes');

    assert.notOk(
      page.person.submitButton.isHighlighted,
      'expected the submit button to not be highlighted before anything has changed'
    );

    await page.person.name.field.fillIn('Jartle');
    await page.person.cancelButton.click();

    assert.ok(
      page.person.name.isHidden,
      'expected the form to be hidden again'
    );

    await page.person.toggle.click();

    assert.equal(
      page.person.name.field.value,
      'Jortle Tortle',
      'expected the change to have been reverted'
    );

    await page.person.name.field.fillIn('Jortleby');
    await page.person.activeSwitch.click();
    await page.person.mobile.field.fillIn('1234');
    await page.person.email.desiredMedium.click();
    await page.person.selfNotes.field.fillIn('Updated self notes');

    assert.ok(
      page.person.submitButton.isHighlighted,
      'expected the submit button to be highlighted when the record is dirty'
    );

    await page.person.submitButton.click();

    const [person] = this.server.db.people;

    assert.equal(
      person.name,
      'Jortleby',
      'expected the name to have changed on the server'
    );
    assert.notOk(
      person.active,
      'expected the person to be inactive on the server'
    );
    assert.equal(
      person.mobile,
      '1234',
      'expected the mobile number to have changed on the server'
    );
    assert.equal(
      person.medium,
      'email',
      'expected the medium to have changed on the server'
    );
    assert.equal(
      person.selfNotes,
      'Updated self notes',
      'expected the self notes to have changed on the server'
    );

    assert.equal(shared.toast.text, 'Saved your details');
    assert.ok(
      page.person.name.isHidden,
      'expected the form to be hidden again'
    );

    await page.person.toggle.click();

    assert.notOk(
      page.person.name.isError,
      'expected the name field to not show as being invalid'
    );
  });

  test('the person can get a link to subscribe to their calendar', async function(assert) {
    await page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

    assert.ok(
      page.subscription.link.href.endsWith(
        `/people/${this.person.id}/calendar?secret=SECRET%2B%2B`
      ),
      'expected the calendar URL to have the encoded secret'
    );
  });

  test('shows detail validation errors', async function(assert) {
    await page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

    await page.person.toggle.click();
    await page.person.name.field.fillIn('');
    await page.person.submitButton.click();

    // FIXME validation-specific error text?
    assert.equal(shared.toast.text, 'Couldn’t save your details');
    assert.equal(page.person.name.error.text, "Name can't be blank");
    assert.ok(
      page.person.name.isError,
      'expected the name field to show as being invalid'
    );
  });

  test('handles an error saving details', async function(assert) {
    await page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

    this.server.patch('/people/me', function() {
      return new Mirage.Response(
        401,
        {},
        {
          errors: [
            {
              status: 401,
              title: 'Unauthorized',
            },
          ],
        }
      );
    });

    await page.person.toggle.click();
    await page.person.name.field.fillIn('Jartleby');
    await page.person.submitButton.click();

    assert.equal(shared.toast.text, 'Couldn’t save your details');
    assert.ok(
      page.person.name.isVisible,
      'expected the form to still be visible'
    );
  });

  test('the path controls the month', async function(assert) {
    await page.visit({ month: '2118-01', token: 'MAGIC??TOKEN' });

    assert.equal(page.month, 'January 2118');
  });

  test('an admin can see the commitments with person names', async function(assert) {
    this.server.create('user', { admin: true });
    await authenticateSession({ access_token: 'abcdef' });
    await page.adminVisit({ month: '2117-12' });

    assert.equal(
      page.days[3].slots[0].count.text,
      '2/3',
      'expected two people to show for the slot out of a maximum of three'
    );
    assert.ok(
      page.days[3].slots[0].count.isCommittedTo,
      'expected the two person-slot to show as committed to'
    );
    assert.ok(
      page.days[3].slots[0].checkbox.isHidden,
      'expected the checkbox to not display'
    );

    assert.equal(
      page.people.length,
      0,
      'expected no people details to show initially'
    );

    assert.equal(
      page.days[9].slots[0].count.text,
      '0/∞',
      'expected the slot capacity to show as ∞'
    );
    assert.notOk(
      page.days[9].slots[0].count.isCommittedTo,
      'expected the empty slot to not show as committed to'
    );

    await page.days[3].slots[0].count.click();

    assert.equal(page.viewingSlot, 'Saturday, December 4, 5:30p–8:00p');
    assert.equal(
      page.people.length,
      2,
      'expected two people details to show for the slot'
    );
    assert.equal(page.people[0].name, 'Other Slot Person');
    assert.equal(page.people[1].name, 'Jortle Tortle');

    await page.people[1].reveal();

    assert.equal(
      page.people[1].email,
      'jorts@jants.ca',
      'expected the contact information to be revealed'
    );

    await page.nextMonth.click();

    assert.equal(page.month, 'January 2118: 0 commitments');
    assert.ok(
      currentURL().endsWith('2118-01'),
      'expected the path to have changed with the new month'
    );

    await page.previousMonth.click();

    assert.equal(page.month, 'December 2117: 2 commitments');
    assert.ok(
      currentURL().endsWith('2117-12'),
      'expected the path to have returned to the original month'
    );
  });

  test('an admin can create commitments', async function(assert) {
    this.server.create('user', { admin: true });
    await authenticateSession({ access_token: 'abcdef' });
    await page.adminVisit({ month: '2117-12' });

    await page.days[9].slots[1].count.click();
    await page.peopleSearch.fillIn('commit');

    assert.equal(
      page.peopleSearch.options.length,
      2,
      'expected two people to show for possible commitments'
    );
    assert.equal(page.peopleSearch.options[0].name, 'Also non-committal');
    assert.equal(page.peopleSearch.options[1].name, 'Non-committal');

    await page.peopleSearch.fillIn('also');

    assert.equal(
      page.peopleSearch.options.length,
      1,
      'expected only one match'
    );

    await page.peopleSearch.options[0].click();

    assert.equal(
      shared.toast.text,
      'Committed Also non-committal to drive on December 10'
    );
    assert.equal(
      page.days[9].slots[1].count.text,
      '1/2',
      'expected the slot to be newly committed-to'
    );

    const [, , , commitment] = this.server.db.commitments;
    assert.equal(
      commitment.slotId,
      this.toCommitSlot.id,
      'expected the server to have the newly-created commitment'
    );

    await page.peopleSearch.fillIn('commit');

    assert.equal(
      page.peopleSearch.options.length,
      1,
      'expected the now-commited person to not show in the search'
    );
  });

  test('an error when an admin tries to create a commitment is displayed', async function(assert) {
    this.server.post('/commitments', function() {
      return new Mirage.Response(
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
        }
      );
    });

    this.server.create('user', { admin: true });
    await authenticateSession({ access_token: 'abcdef' });
    await page.adminVisit({ month: '2117-12' });

    await page.days[9].slots[1].count.click();
    await page.peopleSearch.fillIn('also');
    await page.peopleSearch.options[0].click();

    assert.equal(shared.toast.text, 'Fail!');
    assert.equal(
      this.server.db.commitments.length,
      3,
      'expected no change on the server'
    );
  });

  test('an admin can delete commitments', async function(assert) {
    this.server.create('user', { admin: true });
    await authenticateSession({ access_token: 'abcdef' });
    await page.adminVisit({ month: '2117-12' });

    await page.days[3].slots[0].count.click();
    await page.people[0].remove();

    assert.equal(
      shared.toast.text,
      'Deleted Other Slot Person’s commitment on December 4'
    );
    assert.equal(
      this.server.db.commitments.length,
      2,
      'expected there to be two commitments left on the server'
    );
  });

  test('an error when an admin tries to delete a commitment is displayed', async function(assert) {
    this.server.delete('/commitments/:id', function() {
      return new Mirage.Response(
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
        }
      );
    });

    this.server.create('user', { admin: true });
    await authenticateSession({ access_token: 'abcdef' });
    await page.adminVisit({ month: '2117-12' });

    await page.days[3].slots[0].count.click();
    await page.people[0].remove();

    assert.equal(shared.toast.text, 'Fail!');
    assert.equal(
      this.server.db.commitments.length,
      3,
      'expected no change on the server'
    );
  });
});
