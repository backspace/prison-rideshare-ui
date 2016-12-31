import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import page from 'prison-rideshare-ui/tests/pages/people';

moduleForAcceptance('Acceptance | reimbursements', {
  beforeEach() {
    const sun = server.create('person', {name: 'Sun'});
    const kala = server.create('person', {name: 'Kala'});
    const will = server.create('person', {name: 'Will'});

    sun.createReimbursement({amount: 33});
    sun.createReimbursement({amount: 44});

    kala.createReimbursement({amount: 22});

    server.create('ride', {
      driver: sun,
      foodExpenses: 154,

      carOwner: kala,
      carExpenses: 44
    });

    server.create('ride', {
      driver: will,
      carOwner: will
    });
  }
});

test('list people and create a reimbursement', function(assert) {
  page.visit();

  andThen(() => {
    assert.equal(page.people().count, 3, 'expected three people');

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

    const will = page.people(2);
    assert.equal(will.owed, '0');
    assert.equal(will.foodExpenses, '0');
    assert.equal(will.carExpenses, '0');
    assert.equal(will.reimbursements, '0');
  });

  page.people(0).reimburseButton.click();

  andThen(() => {
    assert.equal(page.reimbursementForm.amountField.value, '22', 'expected the default reimbursement amount to equal the amount owed');
  });

  page.reimbursementForm.cancel();

  andThen(() => {
    assert.equal(page.people(0).owed, '22');
  });

  page.people(0).reimburseButton.click();

  page.reimbursementForm.amountField.fill('10');
  page.reimbursementForm.submit();

  andThen(() => {
    assert.equal(page.people(0).owed, '12');
  });
});
