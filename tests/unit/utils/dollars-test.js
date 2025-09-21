/* eslint-disable ember/no-classic-classes */
import EmberObject from '@ember/object';
import classic from 'ember-classic-decorator';
import { module, test } from 'qunit';
import dollars from 'prison-rideshare-ui/utils/dollars';

@classic
class ClassWithDollars extends EmberObject {
  cents = undefined;
  @dollars('cents') dollars;
}

module('Unit - dollars', function () {
  test('converts from cents to dollars', function (assert) {
    assert.equal(ClassWithDollars.create({ cents: 50 }).get('dollars'), 0.5);
  });

  test('converts from dollars to cents', function (assert) {
    assert.equal(ClassWithDollars.create({ dollars: 5.25 }).get('cents'), 525);
    assert.equal(
      ClassWithDollars.create({ dollars: 0.55 }).get('cents'),
      55,
      'expected floating point rounding',
    );
  });
});
