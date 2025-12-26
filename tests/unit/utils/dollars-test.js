/* eslint-disable ember/no-classic-classes */
import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import dollars from 'prison-rideshare-ui/utils/dollars';

class ClassWithDollars extends EmberObject {
  cents = undefined;
  @dollars('cents') dollars;
}

module('Unit - dollars', function () {
  test('converts from cents to dollars', function (assert) {
    assert.strictEqual(
      ClassWithDollars.create({ cents: 50 }).get('dollars'),
      0.5,
    );
  });

  test('converts from dollars to cents', function (assert) {
    assert.strictEqual(
      ClassWithDollars.create({ dollars: 5.25 }).get('cents'),
      525,
    );
    assert.strictEqual(
      ClassWithDollars.create({ dollars: 0.55 }).get('cents'),
      55,
      'expected floating point rounding',
    );
  });
});
