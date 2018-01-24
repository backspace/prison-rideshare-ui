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
  }
});

test('shows ride start times per day', function(assert) {
  page.visit();

  andThen(() => {
    assert.equal(shared.title, 'Statistics · Prison Rideshare');

    assert.equal(page.times.days().count, 8, 'expected seven day rows and the header');
    assert.equal(page.times.days(2).hours(10).text, '1');
  });
});
