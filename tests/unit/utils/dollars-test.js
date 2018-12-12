import EmberObject from '@ember/object';
import { test, module } from 'ember-qunit';
import dollars from 'prison-rideshare-ui/utils/dollars';

const ClassWithDollars = EmberObject.extend({
  cents: undefined,
  dollars: dollars('cents'),
});

module('Unit - dollars');

test('converts from cents to dollars', function(assert) {
  assert.equal(ClassWithDollars.create({ cents: 50 }).get('dollars'), 0.5);
});

test('converts from dollars to cents', function(assert) {
  assert.equal(ClassWithDollars.create({ dollars: 5.25 }).get('cents'), 525);
  assert.equal(
    ClassWithDollars.create({ dollars: 0.55 }).get('cents'),
    55,
    'expected floating point rounding'
  );
});
