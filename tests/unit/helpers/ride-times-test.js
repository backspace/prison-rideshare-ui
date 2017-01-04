import { rideTimes } from 'prison-rideshare-ui/helpers/ride-times';
import { module, test } from 'qunit';

import Ember from 'ember';

module('Unit | Helper | ride times');

test('it formats ride times', function(assert) {
  const ride = Ember.Object.create({
    start: new Date(2016, 11, 25, 10, 15),
    end: new Date(2016, 11, 25, 12, 45)
  });

  assert.equal(rideTimes([ride]), 'Sun Dec 25 10:15am — 12:45');
});
