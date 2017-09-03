import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import page from 'prison-rideshare-ui/tests/pages/institutions';
import shared from 'prison-rideshare-ui/tests/pages/shared';

moduleForAcceptance('Acceptance | institutions', {
  beforeEach() {
    server.create('institution', {name: 'Milner Ridge', rate: 25});
    server.create('institution', {name: 'Headingley', rate: 35});

    authenticateSession(this.application);
  }
});

test('institutions can be listed', function(assert) {
  page.visit();

  andThen(() => {
    assert.equal(shared.title, 'Institutions · Prison Rideshare');

    assert.equal(page.institutions().count, 2, 'expected two institutions to be listed');
    assert.equal(page.institutions(0).name, 'Headingley');
    assert.equal(page.institutions(0).rate, '0.35');
    assert.equal(page.institutions(1).name, 'Milner Ridge');
    assert.equal(page.institutions(1).rate, '0.25');
  });
});
