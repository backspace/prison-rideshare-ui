import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import page from 'prison-rideshare-ui/tests/pages/people';
import shared from 'prison-rideshare-ui/tests/pages/shared';

moduleForAcceptance('Acceptance | people', {
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
    assert.equal(shared.title, 'Drivers · Prison Rideshare');

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

test('a person can be created', function(assert) {
  page.visit();

  page.newPerson();

  andThen(() => assert.equal(page.people().count, '3', 'expected the new person to not yet be listed'));

  page.form.nameField.fill('Capheus');
  page.form.submit();

  andThen(() => {
    assert.equal(page.people().count, '4', 'expected the new person to have been added to the list');
    assert.equal(page.people(0).name, 'Capheus');

    const [,,,capheus] = server.db.people;
    assert.equal(capheus.name, 'Capheus');
  });
});

test('person validation errors are displayed', function(assert) {
  server.post('/people', {
      errors: [{
        'source': {
          'pointer': '/data/attributes/name'
        },
        'detail': 'Name can\'t be blank'
      }]
    }, 422);

  page.visit();
  page.newPerson();
  page.form.submit();

  andThen(() => {
    assert.equal(page.form.nameError.text, 'Name can\'t be blank');
  });
});
