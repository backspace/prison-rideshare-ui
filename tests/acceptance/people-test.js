import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import page from 'prison-rideshare-ui/tests/pages/people';
import ridesPage from 'prison-rideshare-ui/tests/pages/rides';
import shared from 'prison-rideshare-ui/tests/pages/shared';

moduleForAcceptance('Acceptance | people', {
  beforeEach() {
    server.create('person', {name: 'Sun', email: 'sun@sense8', landline: '111', notes: 'notes?'});
    server.create('person', {name: 'Kala', email: 'kala@sense8', mobile: '111'});
    server.create('person', {name: 'Will'});

    server.create('ride');

    authenticateSession(this.application);
  }
});

test('people are listed', function(assert) {
  page.visit();

  andThen(() => {
    page.people(1).as(sun => {
      assert.equal(sun.name, 'Sun');
      assert.equal(sun.email.text, 'sun@sense8');
      assert.equal(sun.email.href, 'mailto:sun@sense8');
      assert.equal(sun.landline.text, '111');
      assert.equal(sun.landline.href, 'tel:111');
      assert.equal(sun.notes.text, 'notes?');
    });
  });
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

test('a person can be created and chosen for a ride', function(assert) {
  ridesPage.visit();
  ridesPage.rides(0).driver.click();

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

  ridesPage.visit();
  ridesPage.rides(0).driver.click();
  selectChoose('.driver md-input-container', 'Capheus');

  andThen(() => {
    assert.equal(ridesPage.rides(0).driver.text, 'Capheus');
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
