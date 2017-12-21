import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import page from 'prison-rideshare-ui/tests/pages/calendar';

moduleForAcceptance('Acceptance | calendar', {
  beforeEach() {
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
      count: 3
    });

    committedSlot.createCommitment({

    });

    // FIXME without this, the Person Bearer isn’t sent by the authoriser… ya
    authenticateSession(this.application);
  }
});

test('calendar shows existing commitments and lets them be changed', function(assert) {
  page.visit({ token: 'MAGICTOKEN' });

  andThen(function() {
    page.days(3).as(d4 => {
      assert.equal(d4.slots().count, 1, 'expected one slot on Monday');
      d4.slots(0).as(s1 => {
        assert.equal(s1.hours, '5PM–8PM');
        assert.equal(s1.count, '2');
        assert.ok(s1.isCommittedTo, 'expected the slot to be committed-to');
      })
    });

    page.days(9).as(d10 => {
      assert.equal(d10.slots().count, 2, 'expected two slots on Sunday');
      d10.slots(0).as(s1 => {
        assert.equal(s1.hours, '11AM–5PM');
        assert.equal(s1.count, '3');
        assert.notOk(s1.isCommittedTo, 'expected the slot to not be committed-to');
      });
      d10.slots(1).as(s2 => {
        assert.equal(s2.hours, '5PM–9PM');
        assert.equal(s2.count, '2');
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
