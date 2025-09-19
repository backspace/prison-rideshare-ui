/* eslint-disable ember/no-classic-classes */
import EmberObject from '@ember/object';
import ReimbursementCollection from 'prison-rideshare-ui/utils/reimbursement-collection';

import { module, test } from 'qunit';

module('Unit | Utility | reimbursement collection', function () {
  const reimbursementDate = new Date('2017-10-23');
  const ride = EmberObject.create({ start: reimbursementDate });

  const today = new Date();
  const dateString = `${
    today.getMonth() + 1
  }/${today.getDate()}/${today.getFullYear()}`;

  const FakeReimbursement = EmberObject.extend({
    ride,
    date: reimbursementDate,
    carExpenses: 0,
    foodExpenses: 0,
  });

  const foodReimbursement = FakeReimbursement.create({
    foodExpenses: 4400,
  });

  const otherFoodReimbursement = FakeReimbursement.create({
    foodExpenses: 5500,
  });

  const carReimbursement = FakeReimbursement.create({
    carExpenses: 3300,
  });

  const otherCarReimbursement = FakeReimbursement.create({
    carExpenses: 2200,
  });

  const person = EmberObject.create({
    name: 'Chelsea',
  });

  test('it generates a clipboard string for car expenses', function (assert) {
    const result = ReimbursementCollection.create({
      person,
      reimbursements: [carReimbursement],
    });
    assert.equal(
      result.get('clipboardText'),
      `${dateString}\tOctober mileage\tChelsea\t-$33\t\t\t`
    );
  });

  test('it generates a clipboard string for car expense donation', function (assert) {
    const result = ReimbursementCollection.create({
      person,
      reimbursements: [carReimbursement, otherCarReimbursement],
      donations: true,
    });
    assert.equal(
      result.get('clipboardText'),
      `${dateString}\tOctober mileage\tChelsea\t-$55\t$55\t\t(donated)`
    );
  });

  test('it generates a clipboard string for car and food expenses', function (assert) {
    const result = ReimbursementCollection.create({
      person,
      reimbursements: [foodReimbursement, carReimbursement],
    });
    assert.equal(
      result.get('clipboardText'),
      `${dateString}\tOctober mileage + meal\tChelsea\t-$77\t\t\t`
    );
  });

  test('it generates a clipboard string for food expenses', function (assert) {
    const result = ReimbursementCollection.create({
      person,
      reimbursements: [foodReimbursement, otherFoodReimbursement],
    });
    assert.equal(
      result.get('clipboardText'),
      `${dateString}\tOctober meal × 2\tChelsea\t-$99\t\t\t`
    );
  });
});
