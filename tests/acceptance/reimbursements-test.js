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

    server.create('ride', {
      driver: sun,
      foodExpenses: 154,

      carOwner: kala,
      carExpenses: 44
    });
  }
});

test('list people', function(assert) {
  server.logging = true;
  page.visit();

  andThen(() => {
    assert.equal(page.people().count, 2, 'expected two people');

    const kala = page.people(0);
    assert.equal(kala.name, 'Kala');
    assert.equal(kala.owed, '22');
    assert.equal(kala.foodExpenses, '0');
    assert.equal(kala.carExpenses, '44');
    assert.equal(kala.reimbursements, '22');

    const sun = page.people(1);
    assert.equal(sun.name, 'Sun');
    assert.equal(sun.owed, '77');
    assert.equal(sun.foodExpenses, '154');
    assert.equal(sun.carExpenses, '0');
    assert.equal(sun.reimbursements, '77');
  });
});
