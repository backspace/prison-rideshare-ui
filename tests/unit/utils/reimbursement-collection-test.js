import ReimbursementCollection from 'prison-rideshare-ui/utils/reimbursement-collection';
import { module, test } from 'qunit';

import Ember from 'ember';

module('Unit | Utility | reimbursement collection');

const reimbursementDate = new Date('2017-09-23');

const today = new Date();
const dateString = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

const FakeReimbursement = Ember.Object.extend({
  date: reimbursementDate,
  carExpenses: 0,
  foodExpenses: 0
});

const foodReimbursement = FakeReimbursement.create({
  date: reimbursementDate,
  foodExpenses: 4400
});

const carReimbursement = FakeReimbursement.create({
  date: reimbursementDate,
  carExpenses: 3300
});

const otherCarReimbursement = FakeReimbursement.create({
  date: reimbursementDate,
  carExpenses: 2200
});

const person = Ember.Object.create({
  name: 'Chelsea'
});

test('it generates a clipboard string for car expenses', function(assert) {
  const result = new ReimbursementCollection({person, reimbursements: [carReimbursement]});
  assert.equal(result.get('clipboardText'), `${dateString}\tAugust mileage\tChelsea\t-$33\t\t\t`);
});

test('it generates a clipboard string for car expense donation', function(assert) {
  const result = new ReimbursementCollection({person, reimbursements: [carReimbursement, otherCarReimbursement], donations: true});
  assert.equal(result.get('clipboardText'), `${dateString}\tAugust mileage\tChelsea\t-$55\t$55\t\t(donated)`);
});

test('it generates a clipboard string for car and food expenses', function(assert) {
  const result = new ReimbursementCollection({person, reimbursements: [foodReimbursement, carReimbursement]});
  assert.equal(result.get('clipboardText'), `${dateString}\tAugust mileage + meal\tChelsea\t-$77\t\t\t`);
});