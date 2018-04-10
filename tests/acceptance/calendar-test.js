import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';
import Mirage from 'ember-cli-mirage';
import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import page from 'prison-rideshare-ui/tests/pages/calendar';
import shared from 'prison-rideshare-ui/tests/pages/shared';

moduleForAcceptance('Acceptance | calendar', {
  beforeEach() {
    const person = server.create('person', {
      name: 'Jortle Tortle',
      email: 'jorts@jants.ca',
      mobile: '5551313',
      medium: 'mobile',
      active: true,
      magicToken: 'MAGIC??TOKEN',
      accessToken: 'XXX',
      calendarSecret: 'SECRET++',
      selfNotes: 'My self notes'
    });
    this.person = person;

    server.create('person', {
      name: 'Non-committal',
      email: 'non@example.com',
      active: true
    });

    server.create('person', {
      name: 'Also non-committal',
      email: 'alsonon@example.com',
      active: true
    });

    server.create('person', {
      name: 'Inactive',
      active: false
    });

    const committedSlot = server.create('slot', {
      start: new Date(2117, 11, 4, 17, 30),
      end: new Date(2117, 11, 4, 20),
      count: 3
    });

    this.toCommitSlot = server.create('slot', {
      start: new Date(2117, 11, 10, 17),
      end: new Date(2117, 11, 10, 21),
      count: 2
    });

    server.create('slot', {
      start: new Date(2117, 11, 10, 11),
      end: new Date(2117, 11, 10, 17),
      count: 0
    });

    committedSlot.createCommitment({ person: server.create('person', { name: 'Other Slot Person'})});
    committedSlot.createCommitment({ person });

    server.create('slot', {
      start: new Date(2017, 11, 10, 11),
      end: new Date(2017, 11, 10, 17),
      count: 0
    });

    const pastCommittedSlot = server.create('slot', {
      start: new Date(2017, 11, 11, 11),
      end: new Date(2017, 11, 11, 17),
      count: 0
    });

    pastCommittedSlot.createCommitment({ person });
  }
});

test('calendar shows existing commitments and lets them be changed', function(assert) {
  page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

  andThen(function() {
    assert.equal(page.personSession, 'Logged in as jorts@jants.ca');
    assert.equal(page.month, 'December 2117');

    page.days(3).as(d4 => {
      assert.equal(d4.slots().count, 1, 'expected one slot on Monday');
      d4.slots(0).as(s1 => {
        assert.equal(s1.hours, '5:30p—8');
        assert.ok(s1.isCommittedTo, 'expected the slot to be committed-to');
        assert.notOk(s1.isDisabled, 'expected the slot to not be full');
        assert.notOk(s1.count.isVisible, 'expected the slot count not to show for a non-admin');
      })
    });

    page.days(9).as(d10 => {
      assert.equal(d10.slots().count, 2, 'expected two slots on Sunday');
      d10.slots(0).as(s1 => {
        assert.equal(s1.hours, '11a—5p');
        assert.notOk(s1.isCommittedTo, 'expected the slot to not be committed-to');
      });
      d10.slots(1).as(s2 => {
        assert.equal(s2.hours, '5p—9');
      });
    });
  });

  page.days(3).slots(0).click();

  andThen(() => {
    assert.equal(shared.toast.text, 'Cancelled your agreement to drive on December 4');
    assert.notOk(page.days(3).slots(0).isCommittedTo, 'expected the slot to not longer be committed-to');
    assert.equal(server.db.commitments.length, 2, 'expected the commitment to have been deleted on the server');
  });
});

test('slots can be committed to', function(assert) {
  page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

  // FIXME this is only a separate test because toasts linger forever in the test environment
  page.days(9).slots(1).click();

  andThen(() => {
    assert.equal(shared.toast.text, 'Thanks for agreeing to drive on December 10!');
    assert.ok(page.days(9).slots(1).isCommittedTo, 'expected the slot to be newly committed-to');

    const [, , , commitment] = server.db.commitments;
    assert.equal(commitment.slotId, this.toCommitSlot.id, 'expected the server to have the newly-created commitment');
  });
});

test('full slots show as full and can’t be committed to', function(assert) {
  server.post('/commitments', function() {
    assert.ok(false, 'expected no commitment to be created for a full slot');
  });

  this.toCommitSlot.createCommitment();
  this.toCommitSlot.createCommitment();

  page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

  andThen(() => {
    assert.ok(page.days(9).slots(1).isDisabled, 'expected the full slot to be disabled');
  });

  page.days(9).slots(1).click();

  andThen(() => {
    assert.notOk(page.days(9).slots(1).isCommittedTo, 'expected the slot to not be committed-to');
  });
});

test('past slots can’t be committed to', function(assert) {
  server.post('/commitments', function() {
    assert.ok(false, 'expected no commitment to be created for a past slot');
  });

  page.visit({ month: '2017-12', token: 'MAGIC??TOKEN' });

  andThen(() => {
    assert.ok(page.days(9).slots(0).isDisabled, 'expected the past slot to be disabled');
    assert.ok(page.days(10).slots(0).isCommittedTo, 'expected the past committed slot to show as committed-to');
    assert.ok(page.days(10).slots(0).isDisabled, 'expected the past committed slot to be disabled');
  });

  page.days(9).slots(0).click();

  andThen(() => {
    assert.notOk(page.days(9).slots(0).isCommittedTo, 'expected the slot to not be committed-to');
  });
});

test('a failure to delete a commitment keeps it displayed and shows an error', function(assert) {
  server.delete('/commitments/:id', function() {
    return new Mirage.Response(401, {}, {
      errors: [{
        status: 401,
        title: 'Unauthorized'
      }]
    });
  });

  page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

  page.days(3).slots(0).click();

  andThen(() => {
    assert.equal(shared.toast.text, 'Couldn’t save your change');
    assert.ok(page.days(3).slots(0).isCommittedTo, 'expected the slot to still be committed-to');
    assert.equal(server.db.commitments.length, 3, 'expected the commitment to still be on the server');
  });
});

test('a failure to create a commitment makes it not display and shows an error', function(assert) {
  server.post('/commitments', function() {
    return new Mirage.Response(401, {}, {
      errors: [{
        status: 401,
        title: 'Unauthorized'
      }]
    });
  });

  page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

  page.days(9).slots(1).click();

  andThen(() => {
    assert.equal(shared.toast.text, 'Couldn’t save your change');
    assert.notOk(page.days(9).slots(1).isCommittedTo, 'expected the slot to not be committed-to');
    assert.equal(server.db.commitments.length, 3, 'expected the commitments to be unchanged on the server');
  });
})

test('a failure to create a commitment with a particular error shows the error', function(assert) {
  server.post('/commitments', function() {
    return new Mirage.Response(422, {}, {
      errors: [{
        status: 422,
        title: 'Unauthorized',
        detail: 'Fail!'
      }]
    });
  });

  page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

  page.days(9).slots(1).click();

  andThen(() => {
    assert.equal(shared.toast.text, 'Fail!');
  });
});

test('visiting with an unknown magic token shows an error', function(assert) {
  page.visit({ month: '2117-12', token: 'JORTLEBY' });

  andThen(function() {
    assert.equal(page.error, 'We were unable to log you in with that token.');
  });
});

test('visiting with no token shows an error', function(assert) {
  page.visit({ month: '2117-12' });

  andThen(function() {
    assert.equal(page.error, 'We were unable to log you in without a token.');
  });
})

test('visiting with a magic token that doesn’t resolve to a person shows an error', function(assert) {
  server.get('/people/me', function() {
    return new Mirage.Response(401, {}, {
      errors: [{
        status: 401,
        title: 'Unauthorized'
      }]
    });
  });

  page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

  andThen(function() {
    assert.equal(page.error, 'We were unable to log you in with that token.');
  });
});

test('the person can edit their details', function(assert) {
  page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

  andThen(() => {
    assert.ok(page.person.name.isHidden, 'expected the name field to be hidden by default');
  });

  page.person.toggle.click();

  andThen(() => {
    assert.ok(page.person.name.isVisible, 'expected the name field to have become visible');
    assert.equal(page.person.name.field.value, 'Jortle Tortle');

    assert.ok(page.person.activeSwitch.enabled, 'expected the active switch to be on');

    assert.ok(page.person.email.field.isDisabled, 'expected the email field to be disabled');
    assert.equal(page.person.email.field.value, 'jorts@jants.ca');

    assert.ok(page.person.mobile.desiredMedium, 'expected mobile to be the desired medium');

    assert.equal(page.person.selfNotes.field.value, 'My self notes');

    assert.notOk(page.person.submitButton.isHighlighted, 'expected the submit button to not be highlighted before anything has changed');
  });

  page.person.name.field.fillIn('Jartle');
  page.person.cancelButton.click();

  andThen(() => {
    assert.ok(page.person.name.isHidden, 'expected the form to be hidden again');
  });

  page.person.toggle.click();

  andThen(() => {
    assert.equal(page.person.name.field.value, 'Jortle Tortle', 'expected the change to have been reverted');
  });

  page.person.name.field.fillIn('Jortleby');
  page.person.activeSwitch.click();
  page.person.mobile.field.fillIn('1234');
  page.person.email.desiredMedium.click();
  page.person.selfNotes.field.fillIn('Updated self notes');

  andThen(() => {
    assert.ok(page.person.submitButton.isHighlighted, 'expected the submit button to be highlighted when the record is dirty');
  });

  page.person.submitButton.click();

  andThen(() => {
    const [person] = server.db.people;

    assert.equal(person.name, 'Jortleby', 'expected the name to have changed on the server');
    assert.notOk(person.active, 'expected the person to be inactive on the server');
    assert.equal(person.mobile, '1234', 'expected the mobile number to have changed on the server');
    assert.equal(person.medium, 'email', 'expected the medium to have changed on the server');
    assert.equal(person.selfNotes, 'Updated self notes', 'expected the self notes to have changed on the server');

    assert.equal(shared.toast.text, 'Saved your details');
    assert.ok(page.person.name.isHidden, 'expected the form to be hidden again');
  });

  page.person.toggle.click();

  andThen(() => {
    assert.notOk(page.person.name.isError, 'expected the name field to not show as being invalid');
  });
});

test('the person can get a link to subscribe to their calendar', function(assert) {
  page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

  andThen(() => {
    assert.ok(page.subscription.link.href.endsWith(`/people/${this.person.id}/calendar?secret=SECRET%2B%2B`), 'expected the calendar URL to have the encoded secret');
  });
});

test('shows detail validation errors', function(assert) {
  page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

  page.person.toggle.click();
  page.person.name.field.fillIn('');
  page.person.submitButton.click();

  andThen(() => {
    // FIXME validation-specific error text?
    assert.equal(shared.toast.text, 'Couldn’t save your details');
    assert.equal(page.person.name.error.text, 'Name can\'t be blank');
    assert.ok(page.person.name.isError, 'expected the name field to show as being invalid');
  });
});

test('handles an error saving details', function(assert) {
  page.visit({ month: '2117-12', token: 'MAGIC??TOKEN' });

  server.patch('/people/me', function() {
    return new Mirage.Response(401, {}, {
      errors: [{
        status: 401,
        title: 'Unauthorized'
      }]
    });
  });

  page.person.toggle.click();
  page.person.name.field.fillIn('Jartleby');
  page.person.submitButton.click();

  andThen(() => {
    assert.equal(shared.toast.text, 'Couldn’t save your details');
    assert.ok(page.person.name.isVisible, 'expected the form to still be visible');
  });
});

test('the path controls the month', function(assert) {
  page.visit({ month: '2118-01', token: 'MAGIC??TOKEN' });

  andThen(function() {
    assert.equal(page.month, 'January 2118');
  });
});

test('an admin can see the commitments with person names', function(assert) {
  server.create('user', { admin: true });
  authenticateSession(this.application, { access_token: 'abcdef' });
  page.adminVisit({ month: '2117-12' });

  andThen(() => {
    assert.equal(page.days(3).slots(0).count.text, '2/3', 'expected two people to show for the slot out of a maximum of three');
    assert.ok(page.days(3).slots(0).count.isCommittedTo, 'expected the two person-slot to show as committed to');
    assert.ok(page.days(3).slots(0).checkbox.isHidden, 'expected the checkbox to not display');

    assert.equal(page.people().count, 0, 'expected no people details to show initially');

    assert.equal(page.days(9).slots(0).count.text, '0/∞', 'expected the slot capacity to show as ∞');
    assert.notOk(page.days(9).slots(0).count.isCommittedTo, 'expected the empty slot to not show as committed to');
  });

  page.days(3).slots(0).count.click();

  andThen(() => {
    assert.equal(page.viewingSlot, 'Saturday, December 4, 5:30p–8:00p');
    assert.equal(page.people().count, 2, 'expected two people details to show for the slot');
    assert.equal(page.people(0).name, 'Other Slot Person');
    assert.equal(page.people(1).name, 'Jortle Tortle');
  });

  page.people(1).reveal();

  andThen(() => {
    assert.equal(page.people(1).email, 'jorts@jants.ca', 'expected the contact information to be revealed');
  });

  page.nextMonth.click();

  andThen(() => {
    assert.equal(page.month, 'January 2118: 0 commitments');
    assert.ok(currentURL().endsWith('2118-01'), 'expected the path to have changed with the new month');
  });

  page.previousMonth.click();

  andThen(() => {
    assert.equal(page.month, 'December 2117: 2 commitments');
    assert.ok(currentURL().endsWith('2117-12'), 'expected the path to have returned to the original month');
  });
});

test('an admin can create commitments', function(assert) {
  server.create('user', { admin: true });
  authenticateSession(this.application, { access_token: 'abcdef' });
  page.adminVisit({ month: '2117-12' });

  page.days(9).slots(1).count.click();
  page.peopleSearch.fillIn('commit');

  andThen(() => {
    assert.equal(page.peopleSearch.options().count, 2, 'expected two people to show for possible commitments');
    assert.equal(page.peopleSearch.options(0).name, 'Also non-committal');
    assert.equal(page.peopleSearch.options(1).name, 'Non-committal');
  });

  page.peopleSearch.fillIn('also');

  andThen(() => {
    assert.equal(page.peopleSearch.options().count, 1, 'expected only one match');
  });

  page.peopleSearch.options(0).click();

  andThen(() => {
    assert.equal(shared.toast.text, 'Committed Also non-committal to drive on December 10');
    assert.equal(page.days(9).slots(1).count.text, '1/2', 'expected the slot to be newly committed-to');

    const [, , , commitment] = server.db.commitments;
    assert.equal(commitment.slotId, this.toCommitSlot.id, 'expected the server to have the newly-created commitment');
  });

  page.peopleSearch.fillIn('commit');

  andThen(() => {
    assert.equal(page.peopleSearch.options().count, 1, 'expected the now-commited person to not show in the search');
  });
});

test('an error when an admin tries to create a commitment is displayed', function(assert) {
  server.post('/commitments', function() {
    return new Mirage.Response(422, {}, {
      errors: [{
        status: 422,
        title: 'Unauthorized',
        detail: 'Fail!'
      }]
    });
  });

  server.create('user', { admin: true });
  authenticateSession(this.application, { access_token: 'abcdef' });
  page.adminVisit({ month: '2117-12' });

  page.days(9).slots(1).count.click();
  page.peopleSearch.fillIn('also');
  page.peopleSearch.options(0).click();

  andThen(() => {
    assert.equal(shared.toast.text, 'Fail!');
    assert.equal(server.db.commitments.length, 3, 'expected no change on the server');
  });
});

test('an admin can delete commitments', function(assert) {
  server.create('user', { admin: true });
  authenticateSession(this.application, { access_token: 'abcdef' });
  page.adminVisit({ month: '2117-12' });

  page.days(3).slots(0).count.click();
  page.people(0).remove();

  andThen(() => {
    assert.equal(shared.toast.text, 'Deleted Other Slot Person’s commitment on December 4');
    assert.equal(server.db.commitments.length, 2, 'expected there to be two commitments left on the server');
  });
});

test('an error when an admin tries to delete a commitment is displayed', function(assert) {
  server.delete('/commitments/:id', function() {
    return new Mirage.Response(422, {}, {
      errors: [{
        status: 422,
        title: 'Unauthorized',
        detail: 'Fail!'
      }]
    });
  });

  server.create('user', { admin: true });
  authenticateSession(this.application, { access_token: 'abcdef' });
  page.adminVisit({ month: '2117-12' });

  page.days(3).slots(0).count.click();
  page.people(0).remove();

  andThen(() => {
    assert.equal(shared.toast.text, 'Fail!');
    assert.equal(server.db.commitments.length, 3, 'expected no change on the server');
  });
});

test('an admin can send email and get calendar links', function(assert) {
  server.get('/people/:id/calendar-link/2117-12', (schema, {params: {id}}) => {
    return `link-for-${id}`;
  });

  let done = assert.async();

  server.post('/people/:id/calendar-email/2117-12', (schema, {params: {id}}) => {
    assert.equal(id, this.person.id);
    done();
  });

  server.create('user', { admin: true });
  authenticateSession(this.application, { access_token: 'abcdef' });
  page.adminVisit({ month: '2117-12' });

  page.email.open();

  andThen(() => {
    assert.equal(page.email.title, 'December 2117 calendar emails');
    assert.notOk(page.email.sendButton.isRaised, 'expected the send button to not be raised when no one is selected');
  });

  page.email.addActiveButton.click();

  andThen(() => {
    assert.equal(page.email.peopleSearch.chips().count, 4);
  });

  page.email.peopleSearch.chips(0).remove();
  page.email.peopleSearch.chips(0).remove();
  page.email.peopleSearch.chips(0).remove();
  page.email.peopleSearch.chips(0).remove();

  andThen(() => {
    assert.ok(page.email.filter.add.isHidden, 'expected the filter add button to be hidden');
    assert.ok(page.email.filter.remove.isHidden, 'expected the filter remove button to be hidden');
  });

  page.email.filter.fillIn('example');

  andThen(() => {
    assert.ok(page.email.filter.add.isVisible, 'expected the filter add button to be shown');
  });

  page.email.filter.add.click();

  andThen(() => {
    assert.equal(page.email.peopleSearch.chips(0).text, 'Also non-committal: alsonon@example.com');
    assert.equal(page.email.peopleSearch.chips(1).text, 'Non-committal: non@example.com');
  });

  page.email.filter.remove.click();

  andThen(() => {
    assert.equal(page.email.peopleSearch.chips().count, 0);
  });

  page.email.peopleSearch.fillIn('commit');

  andThen(() => {
    assert.equal(page.email.peopleSearch.options(0).label, 'Also non-committal: alsonon@example.com');
    assert.equal(page.email.peopleSearch.options(1).label, 'Non-committal: non@example.com');
  });

  page.email.peopleSearch.options(0).click();

  andThen(() => {
    assert.equal(page.email.peopleSearch.chips.length, 1);
    assert.equal(page.email.peopleSearch.chips(0).text, 'Also non-committal: alsonon@example.com');

    assert.ok(page.email.sendButton.isRaised, 'expected the send button to be raised when someone is selected');
  });

  page.email.peopleSearch.fillIn('ortle');
  page.email.peopleSearch.options(0).click();

  andThen(() => {
    assert.equal(page.email.peopleSearch.chips(1).text, 'Jortle Tortle: jorts@jants.ca');
  });

  page.email.fetchLinksButton.click();

  andThen(() => {
    assert.equal(page.email.links().count, 2);

    page.email.links(0).as(also => {
      assert.equal(also.email, 'alsonon@example.com');
      assert.equal(also.link, 'link-for-3');
      assert.equal(also.mailto, 'mailto:alsonon@example.com?subject=calendar&body=a link link-for-3');
    });
  });

  page.email.peopleSearch.chips(0).remove();
  page.email.sendButton.click();
});
