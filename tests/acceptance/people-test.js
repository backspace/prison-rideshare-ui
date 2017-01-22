import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import page from 'prison-rideshare-ui/tests/pages/people';

moduleForAcceptance('Acceptance | reimbursements', {
  beforeEach() {
    server.create('person', {name: 'Sun'});
    server.create('person', {name: 'Kala'});
    server.create('person', {name: 'Will'});

    authenticateSession(this.application);
  }
});

test('people can be edited, cancelled edits are discarded', function(assert) {
  page.visit();

  page.people(2).edit();
  page.form.nameField.fill('Billiam');
  page.form.cancel();

  andThen(() => {
    assert.equal(page.people(2).name, 'Will');

    const serverPeople = server.db.people;
    const will = serverPeople[serverPeople.length - 1];

    assert.equal(will.name, 'Will');
  });

  page.people(2).edit();
  page.form.nameField.fill('William');
  page.form.submit();

  andThen(() => {
    assert.equal(page.people(2).name, 'William');

    const serverPeople = server.db.people;
    const will = serverPeople[serverPeople.length - 1];

    assert.equal(will.name, 'William');
  });
});
