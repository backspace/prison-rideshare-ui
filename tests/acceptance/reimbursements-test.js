import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import page from 'prison-rideshare-ui/tests/pages/people';

moduleForAcceptance('Acceptance | reimbursements', {
  beforeEach() {
    const sun = server.create('person', {name: 'Sun'});
    const kala = server.create('person', {name: 'Kala'});

    sun.createReimbursement({amount: 33});
    sun.createReimbursement({amount: 44});

    kala.createReimbursement({amount: 22});
  }
});

test('list people', function(assert) {
  page.visit();

  andThen(() => {
    assert.equal(page.people().count, 2, 'expected two people');

    assert.equal(page.people(0).name, 'Kala');
    assert.equal(page.people(0).owed, '-22');
    assert.equal(page.people(1).name, 'Sun');
    assert.equal(page.people(1).owed, '-77');
  });
});
