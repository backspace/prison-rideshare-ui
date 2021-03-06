import parseTimespan from 'prison-rideshare-ui/utils/parse-timespan';
import { module, test } from 'qunit';

import moment from 'moment';

module('Unit | Utility | parse timespan', function(hooks) {
  hooks.beforeEach(function() {
    const afterMidnight = new Date(1506490200000);
    window.chronokinesis.travel(afterMidnight);
  });

  hooks.afterEach(function() {
    window.chronokinesis.reset();
  });

  const formatString = 'YYYY-MM-DD HH:mm';

  const assertParsing = function(
    assert,
    timespanString,
    startString,
    endString
  ) {
    const parsed = parseTimespan(timespanString);

    assert.equal(moment(parsed.start.date()).format(formatString), startString);
    assert.equal(moment(parsed.end.date()).format(formatString), endString);
  };

  test('it parses a well-specified timespan', function(assert) {
    assertParsing(
      assert,
      'september 27 2017 from 1pm to 3pm',
      '2017-09-27 13:00',
      '2017-09-27 15:00'
    );
  });

  test('it assumes the end meridiem is the same as the start meridiem', function(assert) {
    assertParsing(
      assert,
      'september 27 2017 from 1pm to 3',
      '2017-09-27 13:00',
      '2017-09-27 15:00'
    );
  });

  test('it allows the end meridiem to be overridden', function(assert) {
    assertParsing(
      assert,
      'september 27 2017 from 10am to 11pm',
      '2017-09-27 10:00',
      '2017-09-27 23:00'
    );
  });

  test('it assumes PM if unspecified', function(assert) {
    assertParsing(
      assert,
      'september 27 2017 from 630 to 9',
      '2017-09-27 18:30',
      '2017-09-27 21:00'
    );
  });

  test('it assumes PM if unspecified even for start alone', function(assert) {
    const parsed = parseTimespan('september 27 2017 from 630');

    assert.equal(
      moment(parsed.start.date()).format(formatString),
      '2017-09-27 18:30'
    );
    assert.notOk(parsed.end);
  });

  test('it assumes future dates unless fully specified', function(assert) {
    window.chronokinesis.travel(new Date(1570925744254));
    // Saturday 2019-10-12 19:15

    assertParsing(
      assert,
      'thursday from 7 to 9',
      '2019-10-17 19:00',
      '2019-10-17 21:00'
    );

    assertParsing(
      assert,
      'oct 10 2019 from 1 to 4',
      '2019-10-10 13:00',
      '2019-10-10 16:00'
    );
  });
});
