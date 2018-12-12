import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import page from 'prison-rideshare-ui/tests/pages/statistics';
import shared from 'prison-rideshare-ui/tests/pages/shared';

import moment from 'moment';

const format = 'YYYY-MM-DD';

moduleForAcceptance('Acceptance | statistics', {
  beforeEach() {
    authenticateSession(this.application);
  }
});

test('has convenience buttons for timespans', function(assert) {
  page.visit();

  andThen(() => {
    assert.equal(shared.title, 'Statistics · Prison Rideshare');

    assert.equal(page.start.value, moment().subtract(1, 'year').format(format), 'expected the start date to be a year ago');
    assert.equal(page.end.value, moment().format(format), 'expected the end date to be today');
  });

  page.pastTwoWeeks.click();

  andThen(() => {
    assert.equal(page.start.value, moment().subtract(2, 'weeks').format(format), 'expected the start date to be two weeks ago');
    assert.equal(page.end.value, moment().format(format), 'expected the end date to be today');
  });

  page.thisYear.click();

  andThen(() => {
    assert.equal(page.start.value, moment().startOf('year').format(format), 'expected the start date to be the beginning of this year');
    assert.equal(page.end.value, moment().format(format), 'expected the end date to be today');
  });

  page.pastYear.click();

  andThen(() => {
    assert.equal(page.start.value, moment().subtract(1, 'year').format(format), 'expected the start date to be a year ago');
    assert.equal(page.end.value, moment().format(format), 'expected the end date to be today');
  });
});
