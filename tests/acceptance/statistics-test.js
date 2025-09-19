import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers/application-tests';
import { percySnapshot } from 'ember-percy';

import { authenticateSession } from 'ember-simple-auth/test-support';

import page from 'prison-rideshare-ui/tests/pages/statistics';
import shared from 'prison-rideshare-ui/tests/pages/shared';

import moment from 'moment';

const format = 'YYYY-MM-DD';

module('Acceptance | statistics', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    await authenticateSession();
  });

  test('has convenience buttons for timespans', async function (assert) {
    await page.visit();

    assert.equal(shared.title, 'Statistics · Prison Rideshare');

    assert.equal(
      page.start.value,
      moment().subtract(1, 'year').format(format),
      'expected the start date to be a year ago'
    );
    assert.equal(
      page.end.value,
      moment().format(format),
      'expected the end date to be today'
    );

    await page.pastTwoWeeks.click();

    assert.equal(
      page.start.value,
      moment().subtract(2, 'weeks').format(format),
      'expected the start date to be two weeks ago'
    );
    assert.equal(
      page.end.value,
      moment().format(format),
      'expected the end date to be today'
    );

    await page.thisYear.click();

    assert.equal(
      page.start.value,
      moment().startOf('year').format(format),
      'expected the start date to be the beginning of this year'
    );
    assert.equal(
      page.end.value,
      moment().format(format),
      'expected the end date to be today'
    );

    await page.pastYear.click();

    assert.equal(
      page.start.value,
      moment().subtract(1, 'year').format(format),
      'expected the start date to be a year ago'
    );
    assert.equal(
      page.end.value,
      moment().format(format),
      'expected the end date to be today'
    );

    percySnapshot(assert);
  });
});
