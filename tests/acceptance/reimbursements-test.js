/* eslint-disable qunit/require-expect */
import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers/application-tests';
import { percySnapshot } from 'ember-percy';

import { authenticateSession } from 'ember-simple-auth/test-support';

import reimbursementsPage from 'prison-rideshare-ui/tests/pages/reimbursements';
import shared from 'prison-rideshare-ui/tests/pages/shared';

module('Acceptance | reimbursements', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    const sun = this.server.create('person', { name: 'Sun' });
    const kala = this.server.create('person', { name: 'Kala' });
    const will = this.server.create('person', { name: 'Will' });

    const leavenworth = this.server.create('institution', {
      name: 'Fort Leavenworth',
    });

    const unprocessedRideNextMonth = this.server.create('ride', {
      start: new Date(2017, 4, 22),
    });
    const unprocessedRide = this.server.create('ride', {
      start: new Date(2017, 3, 22),
    });

    sun.createReimbursement({
      ride: unprocessedRideNextMonth,
      carExpenses: 9900,
    });
    sun.createReimbursement({
      ride: unprocessedRideNextMonth,
      foodExpenses: 100,
    });
    sun.createReimbursement({
      ride: unprocessedRideNextMonth,
      foodExpenses: 200,
    });
    kala.createReimbursement({
      ride: unprocessedRideNextMonth,
      carExpenses: 1100,
      donation: true,
    });

    sun.createReimbursement({ ride: unprocessedRide, carExpenses: 3300 });
    sun.createReimbursement({ ride: unprocessedRide, foodExpenses: 4400 });

    kala.createReimbursement({ ride: unprocessedRide, carExpenses: 2200 });
    kala.createReimbursement({
      ride: unprocessedRide,
      carExpenses: 100,
      donation: true,
    });

    will.createReimbursement({
      ride: unprocessedRide,
      carExpenses: 111,
      donation: true,
    });
    will.createReimbursement({
      ride: unprocessedRide,
      carExpenses: 222,
      donation: true,
    });

    const reimbursedRide = this.server.create('ride', {
      institution: leavenworth,
      start: new Date(2017, 2, 22),
      driver: kala,
      carOwner: kala,
    });

    kala.createReimbursement({
      ride: reimbursedRide,
      carExpenses: 999,
      processed: true,
      donation: true,
      insertedAt: new Date(2017, 2, 25),
    });
    kala.createReimbursement({
      ride: reimbursedRide,
      foodExpenses: 1100,
      processed: true,
      insertedAt: new Date(2017, 2, 26),
    });

    this.server.create('ride', {
      driver: sun,
      foodExpenses: 15400,

      carOwner: kala,
      carExpenses: 4400,
    });

    this.server.create('ride', {
      driver: will,
      carOwner: will,
    });

    await authenticateSession(this.application);
  });

  test('list reimbursements and optionally show processed ones', async function (assert) {
    await reimbursementsPage.visit();

    assert.equal(shared.title, 'Reimbursements · Prison Rideshare');

    assert.equal(
      reimbursementsPage.rows.length,
      8,
      'expected two month rows and six person reimbursement rows'
    );

    assert.equal(reimbursementsPage.rows[0].month, 'April 2017');

    const kala = reimbursementsPage.rows[1];
    assert.equal(kala.name, 'Kala');
    assert.equal(
      kala.foodExpenses,
      '0',
      'expected the processed reimbursement to be excluded'
    );
    assert.equal(kala.carExpenses, '22');
    assert.equal(kala.totalExpenses, '22');
    assert.ok(
      kala.processButton.isPrimary,
      'expected the process button to be default for non-donations'
    );
    assert.notOk(
      kala.donateButton.isPrimary,
      'expected the donate button to not be default for non-donations'
    );

    await reimbursementsPage.rows[2].as((kalaDonation) => {
      assert.equal(kalaDonation.name, '');
      assert.equal(kalaDonation.foodExpenses, '');
      assert.equal(kalaDonation.carExpenses, '1');
      assert.ok(
        kalaDonation.carExpenseIsDonation,
        'expected the donation to be thus marked'
      );
      assert.notOk(
        kalaDonation.processButton.isPrimary,
        'expected the process button to not be default for donations'
      );
      assert.ok(
        kalaDonation.donateButton.isPrimary,
        'expected the donate button to be default for donations'
      );
    });

    const sun = reimbursementsPage.rows[3];
    assert.equal(sun.name, 'Sun');
    assert.equal(sun.foodExpenses, '44');
    assert.equal(sun.carExpenses, '33');
    assert.equal(sun.totalExpenses, '77');

    await reimbursementsPage.rows[4].as((willDonation) => {
      assert.equal(willDonation.name, 'Will');
      assert.equal(willDonation.carExpenses, '3.33');
    });

    assert.equal(
      reimbursementsPage.reimbursements.length,
      0,
      'expected no processed reimbursements to be shown'
    );

    assert.equal(reimbursementsPage.rows[5].month, 'May 2017');
    assert.equal(reimbursementsPage.rows[7].name, 'Sun');
    assert.equal(reimbursementsPage.rows[7].carExpenses, '99');

    await reimbursementsPage.processedSwitch.click();

    assert.equal(
      reimbursementsPage.reimbursements.length,
      2,
      'expected the processed reimbursements to be shown'
    );

    const foodProcessed = reimbursementsPage.reimbursements[0];
    assert.equal(foodProcessed.date, '2017-03-26');
    assert.equal(foodProcessed.name, 'Kala');
    assert.equal(foodProcessed.ride, '2017-03-22 to Fort Leavenworth');
    assert.equal(foodProcessed.expenses, '11');
    assert.ok(foodProcessed.isFoodExpense, 'expected a food expense icon');
    assert.notOk(
      foodProcessed.isDonation,
      'expected the food expense to not have been donated'
    );

    const carProcessed = reimbursementsPage.reimbursements[1];
    assert.equal(carProcessed.date, '2017-03-25');
    assert.equal(carProcessed.name, 'Kala');
    assert.equal(carProcessed.expenses, '9.99');
    assert.ok(carProcessed.isCarExpense, 'expected a car expense icon');
    assert.ok(
      carProcessed.isDonation,
      'expected the car expense to have been donated'
    );

    percySnapshot(assert);
  });

  test('process reimbursements', async function (assert) {
    await reimbursementsPage.visit();

    await reimbursementsPage.rows[3].processButton.click();

    const [, , , , sun1, sun2] = this.server.db.reimbursements;

    assert.ok(sun1.processed);
    assert.notOk(sun2.donation);

    assert.ok(sun2.processed);
    assert.notOk(sun2.donation);

    await reimbursementsPage.rows[1].donateButton.click();
    await reimbursementsPage.rows[1].donateButton.click();
    await reimbursementsPage.rows[1].donateButton.click();
    await reimbursementsPage.rows[1].donateButton.click();
    await reimbursementsPage.rows[1].donateButton.click();

    const [, , , , , , k] = this.server.db.reimbursements;

    assert.ok(
      k.processed,
      'expected the reimbursement to have been marked as processed'
    );
    assert.ok(
      k.donation,
      'expected the reimbursement to have been marked as a donation'
    );

    assert.ok(reimbursementsPage.noReimbursementsMessage.isVisible);
  });

  test('rows can be copied for the ledger', async function (assert) {
    await reimbursementsPage.visit();

    const clipboardText = reimbursementsPage.rows[2].copyButton.clipboardText;
    const expectedClipboardTextEnding =
      'April mileage\tKala\t-$1\t$1\t\t(donated)';
    assert.ok(
      clipboardText.includes(expectedClipboardTextEnding),
      `expected April clipboard text to include ${expectedClipboardTextEnding}, got ${clipboardText}`
    );

    const mayClipboardText =
      reimbursementsPage.rows[5].copyButton.clipboardText;
    const [kalaClipboardText, sunClipboardText] = mayClipboardText.split('\n');
    const expectedKalaClipboardTextEnding =
      'May mileage\tKala\t-$11\t$11\t\t(donated)';
    const expectedSunClipboardTextEnding =
      'May mileage + meal × 2\tSun\t-$102\t\t';
    assert.ok(
      kalaClipboardText.includes(expectedKalaClipboardTextEnding),
      `expected Kala clipboard text to include ${expectedKalaClipboardTextEnding}, got ${kalaClipboardText}`
    );
    assert.ok(
      sunClipboardText.includes(expectedSunClipboardTextEnding),
      `expected Sun clipboard text to include ${expectedSunClipboardTextEnding}, got ${sunClipboardText}`
    );
  });
});
