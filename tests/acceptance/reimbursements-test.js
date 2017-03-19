import { skip } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import peoplePage from 'prison-rideshare-ui/tests/pages/people';
import reimbursementsPage from 'prison-rideshare-ui/tests/pages/reimbursements';

moduleForAcceptance('Acceptance | reimbursements', {
  beforeEach() {
    const sun = server.create('person', {name: 'Sun'});
    const kala = server.create('person', {name: 'Kala'});
    const will = server.create('person', {name: 'Will'});

    sun.createReimbursement({amount: 3300, donation: true});
    sun.createReimbursement({amount: 4400});

    kala.createReimbursement({amount: 2200});

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

skip('list and sort people', function(assert) {
  peoplePage.visit();

  andThen(() => {
    assert.equal(peoplePage.people().count, 3, 'expected three people');

    const kala = peoplePage.people(0);
    assert.equal(kala.name, 'Kala');
    assert.equal(kala.owed, '22');
    assert.equal(kala.foodExpenses, '0');
    assert.equal(kala.carExpenses, '44');
    assert.equal(kala.reimbursements, '22');

    const sun = peoplePage.people(1);
    assert.equal(sun.name, 'Sun');
    assert.equal(sun.owed, '77');
    assert.equal(sun.foodExpenses, '154');
    assert.equal(sun.carExpenses, '0');
    assert.equal(sun.reimbursements, '77');

    const will = peoplePage.people(2);
    assert.equal(will.owed, '0');
    assert.equal(will.foodExpenses, '0');
    assert.equal(will.carExpenses, '0');
    assert.equal(will.reimbursements, '0');
  });

  peoplePage.people().head.clickName();

  andThen(() => {
    assert.equal(peoplePage.people(0).name, 'Will');
  });

  // FIXME it’s preferable to sort in descending order by default!
  peoplePage.people().head.clickOwed();
  peoplePage.people().head.clickOwed();

  andThen(() => {
    assert.equal(peoplePage.people(0).name, 'Sun');
  });

  peoplePage.people().head.clickOwed();

  andThen(() => {
    assert.equal(peoplePage.people(0).name, 'Will');
  });
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
