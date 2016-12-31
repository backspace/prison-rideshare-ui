import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import page from 'prison-rideshare-ui/tests/pages/people';

moduleForAcceptance('Acceptance | reimbursements', {
  beforeEach() {
    server.create('person', {name: 'Sun'});
    server.create('person', {name: 'Kala'});
  }
});

test('list people', function(assert) {
  page.visit();

  andThen(() => {
    assert.equal(page.people().count, 2, 'expected two people');
    assert.equal(page.people(0).name, 'Sun');
    assert.equal(page.people(1).name, 'Kala');
  });
});
