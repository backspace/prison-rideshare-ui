import formatTimespan from 'prison-rideshare-ui/utils/format-timespan';
import { module, test } from 'qunit';

module('Unit | Utility | format timespan', function() {
  test('it makes timespans readable', function(assert) {
    const noMinutesSameMeridiem = formatTimespan(
      new Date(2010, 5, 26, 13, 0, 0),
      new Date(2010, 5, 26, 15, 0, 0)
    );

    assert.equal(noMinutesSameMeridiem, 'Sat Jun 26 2010 1p — 3');

    const minutesSameMeridiem = formatTimespan(
      new Date(2010, 5, 26, 15, 30, 0),
      new Date(2010, 5, 26, 16, 48, 0)
    );

    assert.equal(minutesSameMeridiem, 'Sat Jun 26 2010 3:30p — 4:48');

    const sameDayDifferentMeridiem = formatTimespan(
      new Date(2010, 5, 27, 10, 22, 0),
      new Date(2010, 5, 27, 19, 0, 0)
    );

    assert.equal(sameDayDifferentMeridiem, 'Sun Jun 27 2010 10:22a — 7p');
  });
});
