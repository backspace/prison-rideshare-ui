import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';
import Mirage from 'ember-cli-mirage';

import page from 'prison-rideshare-ui/tests/pages/calendar';
import shared from 'prison-rideshare-ui/tests/pages/shared';

moduleForAcceptance('Acceptance | calendar', {
  beforeEach() {
    const person = server.create('person', {
      email: 'jorts@jants.ca',
      magicToken: 'MAGIC??TOKEN',
      accessToken: 'XXX'
    });

    const committedSlot = server.create('slot', {
      start: new Date(2017, 11, 4, 17),
      end: new Date(2017, 11, 4, 20),
      count: 2
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

    committedSlot.createCommitment({ person });
  }
});

test('calendar shows existing commitments and lets them be changed', function(assert) {
  page.visit({ token: 'MAGIC??TOKEN' });

  andThen(function() {
    assert.equal(page.personSession, 'You are logged in as jorts@jants.ca');
    page.days(3).as(d4 => {
      assert.equal(d4.slots().count, 1, 'expected one slot on Monday');
      d4.slots(0).as(s1 => {
        assert.equal(s1.hours, '5P–8P');
        assert.ok(s1.isCommittedTo, 'expected the slot to be committed-to');
        assert.notOk(s1.isFull, 'expected the slot to not be full');
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
    assert.equal(server.db.commitments.length, 0, 'expected the commitment to have been deleted on the server');
  });

  page.days(9).slots(1).click();

  andThen(() => {
    assert.ok(page.days(9).slots(1).isCommittedTo, 'expected the slot to be newly committed-to');

    const [commitment] = server.db.commitments;
    assert.equal(commitment.slotId, this.toCommitSlot.id, 'expected the server to have the newly-created commitment');
  });
});

test('full slots show as full and can’t be committed to', function(assert) {
  server.post('/commitments', function() {
    assert.ok(false, 'expected no commitment to be created for a full slot');
  });

  this.toCommitSlot.createCommitment();
  this.toCommitSlot.createCommitment();

  page.visit({ token: 'MAGIC??TOKEN' });

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

  page.visit({ token: 'MAGIC??TOKEN' });

  page.days(3).slots(0).click();

  andThen(() => {
    assert.equal(shared.toast.text, 'Couldn’t save your change');
    assert.ok(page.days(3).slots(0).isCommittedTo, 'expected the slot to still be committed-to');
    assert.equal(server.db.commitments.length, 1, 'expected the commitment to still be on the server');
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

  page.visit({ token: 'MAGIC??TOKEN' });

  page.days(9).slots(1).click();

  andThen(() => {
    assert.equal(shared.toast.text, 'Couldn’t save your change');
    assert.notOk(page.days(9).slots(1).isCommittedTo, 'expected the slot to not be committed-to');
    assert.equal(server.db.commitments.length, 1, 'expected the commitments to be unchanged on the server');
  });
})

test('visiting with an unknown magic token shows an error', function(assert) {
  page.visit({ token: 'JORTLEBY' });

  andThen(function() {
    assert.equal(page.error, 'We were unable to log you in with that token.');
  });
});

test('visiting with no token shows an error', function(assert) {
  page.visit();

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

  page.visit({ token: 'MAGIC??TOKEN' });

  andThen(function() {
    assert.equal(page.error, 'We were unable to log you in with that token.');
  });
});
