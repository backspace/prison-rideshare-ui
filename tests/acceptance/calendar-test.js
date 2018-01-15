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
      accessToken: 'XXX'
    });

    const committedSlot = server.create('slot', {
      start: new Date(2017, 11, 4, 17),
      end: new Date(2017, 11, 4, 20),
      count: 3
    });

    this.toCommitSlot = server.create('slot', {
      start: new Date(2017, 11, 10, 17),
      end: new Date(2017, 11, 10, 21),
      count: 2
    });

    server.create('slot', {
      start: new Date(2017, 11, 10, 11),
      end: new Date(2017, 11, 10, 17),
      count: 0
    });

    committedSlot.createCommitment({ person: server.create('person', { name: 'Other Slot Person '})});
    committedSlot.createCommitment({ person });
  }
});

test('calendar shows existing commitments and lets them be changed', function(assert) {
  page.visit({ month: '2017-12', token: 'MAGIC??TOKEN' });

  andThen(function() {
    assert.equal(page.personSession, 'You are logged in as jorts@jants.ca');
    assert.equal(page.month, 'December 2017');

    page.days(3).as(d4 => {
      assert.equal(d4.slots().count, 1, 'expected one slot on Monday');
      d4.slots(0).as(s1 => {
        assert.equal(s1.hours, '5P–8P');
        assert.ok(s1.isCommittedTo, 'expected the slot to be committed-to');
        assert.notOk(s1.isFull, 'expected the slot to not be full');
        assert.notOk(s1.count.isVisible, 'expected the slot count not to show for a non-admin');
      })
    });

    page.days(9).as(d10 => {
      assert.equal(d10.slots().count, 2, 'expected two slots on Sunday');
      d10.slots(0).as(s1 => {
        assert.equal(s1.hours, '11A–5P');
        assert.notOk(s1.isCommittedTo, 'expected the slot to not be committed-to');
      });
      d10.slots(1).as(s2 => {
        assert.equal(s2.hours, '5P–9P');
      });
    });
  });

  page.days(3).slots(0).click();

  andThen(() => {
    assert.notOk(page.days(3).slots(0).isCommittedTo, 'expected the slot to not longer be committed-to');
    assert.equal(server.db.commitments.length, 1, 'expected the commitment to have been deleted on the server');
  });

  page.days(9).slots(1).click();

  andThen(() => {
    assert.ok(page.days(9).slots(1).isCommittedTo, 'expected the slot to be newly committed-to');

    const [, commitment] = server.db.commitments;
    assert.equal(commitment.slotId, this.toCommitSlot.id, 'expected the server to have the newly-created commitment');
  });
});

test('full slots show as full and can’t be committed to', function(assert) {
  server.post('/commitments', function() {
    assert.ok(false, 'expected no commitment to be created for a full slot');
  });

  this.toCommitSlot.createCommitment();
  this.toCommitSlot.createCommitment();

  page.visit({ month: '2017-12', token: 'MAGIC??TOKEN' });

  andThen(() => {
    assert.ok(page.days(9).slots(1).isFull, 'expected the full slot to show as full');
  });

  page.days(9).slots(1).click();

  andThen(() => {
    assert.notOk(page.days(9).slots(1).isCommittedTo, 'expected the slot to not be committed-to');
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

  page.visit({ month: '2017-12', token: 'MAGIC??TOKEN' });

  page.days(3).slots(0).click();

  andThen(() => {
    assert.equal(shared.toast.text, 'Couldn’t save your change');
    assert.ok(page.days(3).slots(0).isCommittedTo, 'expected the slot to still be committed-to');
    assert.equal(server.db.commitments.length, 2, 'expected the commitment to still be on the server');
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

  page.visit({ month: '2017-12', token: 'MAGIC??TOKEN' });

  page.days(9).slots(1).click();

  andThen(() => {
    assert.equal(shared.toast.text, 'Couldn’t save your change');
    assert.notOk(page.days(9).slots(1).isCommittedTo, 'expected the slot to not be committed-to');
    assert.equal(server.db.commitments.length, 2, 'expected the commitments to be unchanged on the server');
  });
})

test('visiting with an unknown magic token shows an error', function(assert) {
  page.visit({ month: '2017-12', token: 'JORTLEBY' });

  andThen(function() {
    assert.equal(page.error, 'We were unable to log you in with that token.');
  });
});

test('visiting with no token shows an error', function(assert) {
  page.visit({ month: '2017-12' });

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

  page.visit({ month: '2017-12', token: 'MAGIC??TOKEN' });

  andThen(function() {
    assert.equal(page.error, 'We were unable to log you in with that token.');
  });
});

test('the person can edit their details', function(assert) {
  page.visit({ month: '2017-12', token: 'MAGIC??TOKEN' });

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

    assert.notOk(page.person.submitButton.isHighlighted, 'expected the submit button to not be highlighted before anything has changed');
  });

  page.person.name.field.fillIn('Jortleby');
  page.person.activeSwitch.click();
  page.person.mobile.field.fillIn('1234');
  page.person.email.desiredMedium.click();

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

    assert.equal(shared.toast.text, 'Saved your details');
    assert.ok(page.person.name.isHidden, 'expected the form to be hidden again');
  });
});

test('shows detail validation errors', function(assert) {
  page.visit({ month: '2017-12', token: 'MAGIC??TOKEN' });

  page.person.toggle.click();
  page.person.name.field.fillIn('');
  page.person.submitButton.click();

  andThen(() => {
    // FIXME validation-specific error text?
    assert.equal(shared.toast.text, 'Couldn’t save your details');
    assert.equal(page.person.name.error.text, 'Name can\'t be blank');
  });
});

test('handles an error saving details', function(assert) {
  page.visit({ month: '2017-12', token: 'MAGIC??TOKEN' });

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
  page.visit({ month: '2018-01', token: 'MAGIC??TOKEN' });

  andThen(function() {
    assert.equal(page.month, 'January 2018');
  });
});

test('an admin can see the commitments with person names', function(assert) {
  server.create('user', { admin: true });
  authenticateSession(this.application, { access_token: 'abcdef' });
  page.adminVisit({ month: '2017-12' });

  andThen(() => {
    assert.equal(page.days(3).slots(0).count.text, 2, 'expected two people to show for the slot');
    assert.ok(page.days(3).slots(0).checkbox.isHidden, 'expected the checkbox to not display');
    assert.equal(page.people().count, 0, 'expected no people details to show initially');
  });

  page.days(3).slots(0).count.click();

  andThen(() => {
    assert.equal(page.viewingSlot, 'Monday, December 4, 5P–8P');
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
    assert.equal(page.month, 'January 2018');
  });

  page.previousMonth.click();

  andThen(() => {
    assert.equal(page.month, 'December 2017');
  });
});
