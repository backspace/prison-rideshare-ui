import formatTimespan from 'prison-rideshare-ui/utils/format-timespan';
import { module, test } from 'qunit';
import moment from 'moment';

module('Unit | Utility | format timespan', function () {
  test('it makes timespans readable', function (assert) {
    const noMinutesSameMeridiem = formatTimespan(
      { moment },
      new Date(2010, 5, 26, 13, 0, 0),
      new Date(2010, 5, 26, 15, 0, 0)
    );

    assert.equal(noMinutesSameMeridiem, 'Sat Jun 26 2010 1pm — 3');

    const minutesSameMeridiem = formatTimespan(
      { moment },
      new Date(2010, 5, 26, 15, 30, 0),
      new Date(2010, 5, 26, 16, 48, 0)
    );

    assert.equal(minutesSameMeridiem, 'Sat Jun 26 2010 3:30pm — 4:48');

    const sameDayDifferentMeridiem = formatTimespan(
      { moment },
      new Date(2010, 5, 27, 10, 22, 0),
      new Date(2010, 5, 27, 19, 0, 0)
    );

    assert.equal(sameDayDifferentMeridiem, 'Sun Jun 27 2010 10:22am — 7pm');

    const differentDay = formatTimespan(
      { moment },
      new Date(2010, 5, 27, 10, 22, 0),
      new Date(2010, 5, 29, 19, 0, 0)
    );

    assert.equal(differentDay, 'Sun Jun 27 2010 10:22am — Tue 7pm');
  });
});
