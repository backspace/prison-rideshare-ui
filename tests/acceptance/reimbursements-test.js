import { skip, test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import peoplePage from 'prison-rideshare-ui/tests/pages/people';
import reimbursementsPage from 'prison-rideshare-ui/tests/pages/reimbursements';
import shared from 'prison-rideshare-ui/tests/pages/shared';

moduleForAcceptance('Acceptance | reimbursements', {
  beforeEach() {
    const sun = server.create('person', {name: 'Sun'});
    const kala = server.create('person', {name: 'Kala'});
    const will = server.create('person', {name: 'Will'});

    const leavenworth = server.create('institution', {
      name: 'Fort Leavenworth'
    });

    sun.createReimbursement({carExpenses: 3300});
    sun.createReimbursement({foodExpenses: 4400});

    kala.createReimbursement({carExpenses: 2200});
    kala.createReimbursement({carExpenses: 100, donation: true});

    will.createReimbursement({carExpenses: 111, donation: true});
    will.createReimbursement({carExpenses: 222, donation: true});

    const reimbursedRide = server.create('ride', {
      institution: leavenworth,
      start: new Date(2017, 2, 22),
      driver: kala,
      carOwner: kala
    });

    kala.createReimbursement({ride: reimbursedRide, carExpenses: 999, processed: true, donation: true, insertedAt: new Date(2017, 2, 25)});
    kala.createReimbursement({ride: reimbursedRide, foodExpenses: 1100, processed: true, insertedAt: new Date(2017, 2, 26)});

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
    assert.equal(shared.title, 'Reimbursements · Prison Rideshare');

    assert.equal(reimbursementsPage.people().count, 4, 'expected three rows with reimbursements');

    const kala = reimbursementsPage.people(0);
    assert.equal(kala.name, 'Kala');
    assert.equal(kala.foodExpenses, '0', 'expected the processed reimbursement to be excluded');
    assert.equal(kala.carExpenses, '22');
    assert.equal(kala.totalExpenses, '22');
    assert.ok(kala.processButton.isPrimary, 'expected the process button to be default for non-donations');
    assert.notOk(kala.donateButton.isPrimary, 'expected the donate button to not be default for non-donations');

    reimbursementsPage.people(1).as(kalaDonation => {
      assert.equal(kalaDonation.name, '');
      assert.equal(kalaDonation.foodExpenses, '');
      assert.equal(kalaDonation.carExpenses, '1');
      assert.ok(kalaDonation.carExpenseIsDonation, 'expected the donation to be thus marked');
      assert.notOk(kalaDonation.processButton.isPrimary, 'expected the process button to not be default for donations');
      assert.ok(kalaDonation.donateButton.isPrimary, 'expected the donate button to be default for donations');
    });

    const sun = reimbursementsPage.people(2);
    assert.equal(sun.name, 'Sun');
    assert.equal(sun.foodExpenses, '44');
    assert.equal(sun.carExpenses, '33');
    assert.equal(sun.totalExpenses, '77');

    reimbursementsPage.people(3).as(willDonation => {
      assert.equal(willDonation.name, 'Will');
      assert.equal(willDonation.carExpenses, '3.33');
    });

    assert.equal(reimbursementsPage.reimbursements().count, 0, 'expected no processed reimbursements to be shown');
  });

  reimbursementsPage.processedSwitch.click();

  andThen(() => {
    assert.equal(reimbursementsPage.reimbursements().count, 2, 'expected the processed reimbursement sto be shown');

    const foodProcessed = reimbursementsPage.reimbursements(0);
    assert.equal(foodProcessed.date, '2017-03-26');
    assert.equal(foodProcessed.name, 'Kala');
    assert.equal(foodProcessed.ride, '2017-03-22 to Fort Leavenworth');
    assert.equal(foodProcessed.expenses, '11');
    assert.ok(foodProcessed.isFoodExpense, 'expected a food expense icon');
    assert.notOk(foodProcessed.isDonation, 'expected the food expense to not have been donated');

    const carProcessed = reimbursementsPage.reimbursements(1);
    assert.equal(carProcessed.date, '2017-03-25');
    assert.equal(carProcessed.name, 'Kala');
    assert.equal(carProcessed.expenses, '9.99');
    assert.ok(carProcessed.isCarExpense, 'expected a car expense icon');
    assert.ok(carProcessed.isDonation, 'expected the car expense to have been donated');
  });
});

test('process reimbursements', function(assert) {
  reimbursementsPage.visit();

  reimbursementsPage.people(2).processButton.click();

  andThen(() => {
    const [sun1, sun2,] = server.db.reimbursements;

    assert.ok(sun1.processed);
    assert.ok(sun2.processed);
  });

  reimbursementsPage.people(0).donateButton.click();
  reimbursementsPage.people(0).donateButton.click();
  reimbursementsPage.people(0).donateButton.click();

  andThen(() => {
    const [, , k] = server.db.reimbursements;

    assert.ok(k.processed, 'expected the reimbursement to have been marked as processed');
    assert.ok(k.donation, 'expected the reimbursement to have been marked as a donation');

    assert.ok(reimbursementsPage.noReimbursementsMessage.isVisible);
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
