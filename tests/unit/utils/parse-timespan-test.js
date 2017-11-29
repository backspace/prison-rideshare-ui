import parseTimespan from 'prison-rideshare-ui/utils/parse-timespan';
import { module, test } from 'qunit';

import moment from 'moment';

module('Unit | Utility | parse timespan', {
  beforeEach() {
    // Date.parse('2017-09-27 00:30:00 CDT')
    const afterMidnight = new Date(1506490200000);
    window.chronokinesis.travel(afterMidnight);
    // this.OriginalDate = window.Date;
    // debugger;
    // const FakeDate = fakeDate({
    //   timezoneOffset: -5*60,
    //   referenceTime: 1506490200000
    // });
    //
    // window.Date = FakeDate;
    // MockDate.set(1506490200000, -5*60);
    // debugger;
  },

  afterEach() {
    // timekeeper.reset();
    // window.Date = this.OriginalDate;
    // MockDate.reset();
    window.chronokinesis.reset();
  }
});

const formatString = 'YYYY-MM-DD HH:mm';

const assertParsing = function(assert, timespanString, startString, endString) {
  const parsed = parseTimespan(timespanString);

  assert.equal(moment(parsed.start.date()).format(formatString), startString);
  assert.equal(moment(parsed.end.date()).format(formatString), endString);
}

test('it parses a well-specified timespan', function(assert) {
  assertParsing(assert, 'september 27 2017 from 1pm to 3pm', '2017-09-27 13:00', '2017-09-27 15:00');
});

test('it assumes the end meridiem is the same as the start meridiem', function(assert) {
  assertParsing(assert, 'september 27 2017 from 1pm to 3', '2017-09-27 13:00', '2017-09-27 15:00');
});

test('it allows the end meridiem to be overridden', function(assert) {
  assertParsing(assert, 'september 27 2017 from 10am to 11pm', '2017-09-27 10:00', '2017-09-27 23:00');
});

test('it assumes PM if unspecified', function(assert) {
  assertParsing(assert, 'september 27 2017 from 630 to 9', '2017-09-27 18:30', '2017-09-27 21:00');
});
