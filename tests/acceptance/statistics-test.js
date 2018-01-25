import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import page from 'prison-rideshare-ui/tests/pages/statistics';
import shared from 'prison-rideshare-ui/tests/pages/shared';

moduleForAcceptance('Acceptance | statistics', {
  beforeEach() {
    authenticateSession(this.application);

    // FIXME this will stop working a year after this date…
    server.create('ride', {
      start: new Date(2017, 11, 25, 17, 0),
      end: new Date(2017, 11, 25, 19, 0)
    });

    server.create('ride', {
      start: new Date(2018, 1, 19, 17, 0),
      end: new Date(2018, 1, 19, 19, 0)
    });
  }
});

test('shows ride start times per day, with a default range of the past year', function(assert) {
  page.visit();

  andThen(() => {
    assert.equal(shared.title, 'Statistics · Prison Rideshare');

    // assert.equal(page.start.value, '2017-01-24', 'expected the start date to be a year ago');
    // assert.equal(page.end.value, '2018-01-24', 'expected the end date to be today');
  });

  // page.pastTwoWeeks.click();
  //
  // andThen(() => {
  //   assert.equal(page.start.value, '2018-01-10', 'expected the start date to be two weeks ago');
  //   assert.equal(page.end.value, '2018-01-24', 'expected the end date to be today');
  // });
  //
  // page.pastYear.click();
  //
  // andThen(() => {
  //   assert.equal(page.start.value, '2017-01-24', 'expected the start date to be a year ago');
  //   assert.equal(page.end.value, '2018-01-24', 'expected the end date to be today');
  // });
});
