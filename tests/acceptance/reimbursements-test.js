import { skip, test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import peoplePage from 'prison-rideshare-ui/tests/pages/people';
import reimbursementsPage from 'prison-rideshare-ui/tests/pages/reimbursements';

moduleForAcceptance('Acceptance | reimbursements', {
  beforeEach() {
    const sun = server.create('person', {name: 'Sun'});
    const kala = server.create('person', {name: 'Kala'});
    const will = server.create('person', {name: 'Will'});

    sun.createReimbursement({carExpenses: 3300});
    sun.createReimbursement({foodExpenses: 4400});

    kala.createReimbursement({carExpenses: 2200});
    kala.createReimbursement({foodExpenses: 1100, processed: true});

    server.create('ride', {
      driver: sun,
      foodExpenses: 15400,

      carOwner: kala,
      carExpenses: 4400
    });

    server.create('ride', {
      driver: will,
      carOwner: will
    });

    authenticateSession(this.application);
  }
});

test('list reimbursements and optionally show processed ones', function(assert) {
  reimbursementsPage.visit();

  andThen(() => {
    assert.equal(reimbursementsPage.people().count, 2, 'expected two people with reimbursements');

    const kala = reimbursementsPage.people(0);
    assert.equal(kala.name, 'Kala');
    assert.equal(kala.foodExpenses, '0', 'expected the processed reimbursement to be excluded');
    assert.equal(kala.carExpenses, '22');
    assert.equal(kala.totalExpenses, '22');

    const sun = reimbursementsPage.people(1);
    assert.equal(sun.name, 'Sun');
    assert.equal(sun.foodExpenses, '44');
    assert.equal(sun.carExpenses, '33');
    assert.equal(sun.totalExpenses, '77');

    assert.equal(reimbursementsPage.reimbursements().count, 0, 'expected no processed reimbursements to be shown');
  });

  reimbursementsPage.processedSwitch.click();

  andThen(() => {
    assert.equal(reimbursementsPage.reimbursements().count, 1, 'expected the processed reimbursement to be shown');

    const processed = reimbursementsPage.reimbursements(0);
    assert.equal(processed.name, 'Kala');
    assert.equal(processed.foodExpenses, '11');
    assert.equal(processed.carExpenses, '');
  });
});

test('process reimbursements', function(assert) {
  reimbursementsPage.visit();

  reimbursementsPage.people(1).process();

  andThen(() => {
    const [sun1, sun2,] = server.db.reimbursements;

    assert.ok(sun1.processed);
    assert.ok(sun2.processed);
  });

  reimbursementsPage.people(0).donate();

  andThen(() => {
    const [, , k] = server.db.reimbursements;

    assert.ok(k.processed, 'expected the reimbursement to have been marked as processed');
    assert.ok(k.donation, 'expected the reimbursement to have been marked as a donation');
  })
});

skip('create a reimbursement', function(assert) {
  peoplePage.visit();
  peoplePage.people(0).reimburseButton.click();

  andThen(() => {
    assert.equal(reimbursementsPage.form.amountField.value, '22', 'expected the default reimbursement amount to equal the amount owed');
  });

  reimbursementsPage.form.cancel();

  andThen(() => {
    assert.equal(peoplePage.people(0).owed, '22');
  });

  peoplePage.people(0).reimburseButton.click();

  reimbursementsPage.form.amountField.fill('10');
  reimbursementsPage.form.submit();

  andThen(() => {
    assert.equal(peoplePage.people(0).owed, '12');
  });

  reimbursementsPage.visit();

  andThen(() => {
    assert.equal(reimbursementsPage.reimbursements().count, 4);
    assert.equal(reimbursementsPage.reimbursements(3).amount, '10');
  });
});

skip('edit a reimbursement and the totals and donation status will be updated', function(assert) {
  reimbursementsPage.visit();

  andThen(() => {
    assert.ok(reimbursementsPage.reimbursements(0).donation, 'expected the first reimbursement to be a donation');
  });

  reimbursementsPage.reimbursements(0).edit();

  andThen(() => {
    assert.ok(reimbursementsPage.form.donationCheckbox.checked, 'expected the donation checkbox to be checked');
  });

  reimbursementsPage.form.amountField.fill('44');
  reimbursementsPage.form.donationCheckbox.click();
  reimbursementsPage.form.submit();

  andThen(() => {
    assert.equal(reimbursementsPage.reimbursements(0).amount, '44');
    assert.notOk(reimbursementsPage.reimbursements(0).donation, 'expected the first reimbursements to no longer be a donation');
  });

  peoplePage.visit();

  andThen(() => {
    assert.equal(peoplePage.people(1).owed, '66');
  });
});
