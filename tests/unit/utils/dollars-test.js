import { test, module } from 'ember-qunit';
import Ember from 'ember';
import dollars from 'prison-rideshare-ui/utils/dollars';

const ClassWithDollars = Ember.Object.extend({
  cents: undefined,
  dollars: dollars('cents')
});

module('Unit - dollars');

test('converts from cents to dollars', function(assert) {
  assert.equal(ClassWithDollars.create({cents: 50}).get('dollars'), 0.5);
});

test('converts from dollars to cents', function(assert) {
  assert.equal(ClassWithDollars.create({dollars: 5.25}).get('cents'), 525);
});
