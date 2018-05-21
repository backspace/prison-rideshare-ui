import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import page from 'prison-rideshare-ui/tests/pages/people';
import ridesPage from 'prison-rideshare-ui/tests/pages/rides';
import shared from 'prison-rideshare-ui/tests/pages/shared';

moduleForAcceptance('Acceptance | people', {
  beforeEach() {
    const sun = server.create('person', {name: 'Sun', email: 'sun@sense8', landline: '111', notes: 'notes?', medium: 'email'});

    server.create('ride', {
      start: new Date(2017, 2, 22),
      driver: sun
    });

    server.create('person', {name: 'Kala', email: 'kala@sense8', mobile: '111', medium: 'mobile'});
    server.create('person', {name: 'Will', active: false});

    server.create('ride');

    authenticateSession(this.application);
  }
});

test('people are listed, with inactive people hidden by default', function(assert) {
  page.visit();

  andThen(() => {
    assert.equal(page.people.length, 2, 'expected the inactive person to be hidden');

    page.people[1].as(sun => {
      assert.equal(sun.name, 'Sun');
      assert.equal(sun.email.text, 'sun@sense8');
      assert.equal(sun.email.href, 'mailto:sun@sense8');
      assert.ok(sun.email.isPreferred, 'expected Sun to prefer email');
      assert.equal(sun.landline.text, '111');
      assert.equal(sun.landline.href, 'tel:111');
      assert.equal(sun.lastRide.text, 'March 22, 2017');
      assert.equal(sun.notes.text, 'notes?');
    });

    assert.ok(page.people[0].mobile.isPreferred, 'expected Kala to prefer mobile');
    assert.equal(page.people[0].lastRide.text, '', 'expected someone with no rides to have a blank last ride');
  });

  page.head.inactiveSwitch.click();

  andThen(() => {
    assert.equal(page.people.length, 3, 'expected the inactive person to be shown after the switch is flipped');
  });
});

test('people can be edited, cancelled edits are discarded', function(assert) {
  page.visit();

  page.head.inactiveSwitch.click();

  page.people[2].edit();
  page.form.nameField.fill('Billiam');
  page.form.cancel();

  andThen(() => {
    assert.equal(shared.title, 'Drivers · Prison Rideshare');

    assert.equal(page.people[2].name, 'Will');

    const serverPeople = server.db.people;
    const will = serverPeople[serverPeople.length - 1];

    assert.equal(will.name, 'Will');
  });

  page.people[2].edit();
  page.form.nameField.fill('William');

  page.form.email.field.fillIn('will@sense8');
  page.form.email.desiredMedium.click();

  page.form.mobile.field.fillIn('111');
  page.form.mobile.desiredMedium.click();

  page.form.notes.field.fillIn('notes.');
  page.form.submit();

  andThen(() => {
    assert.equal(page.people[2].name, 'William');

    const serverPeople = server.db.people;
    const will = serverPeople[serverPeople.length - 1];

    assert.equal(will.name, 'William');
    assert.equal(will.email, 'will@sense8');
    assert.equal(will.medium, 'mobile');
  });
});

test('a person can be created and chosen for a ride', function(assert) {
  ridesPage.visit();
  ridesPage.rides[0].driver.click();

  page.visit();

  page.newPerson();

  andThen(() => assert.equal(page.people.length, '2', 'expected the new person to not yet be listed'));

  page.form.nameField.fill('Capheus');
  page.form.submit();

  andThen(() => {
    assert.equal(page.people.length, '3', 'expected the new person to have been added to the list');
    assert.equal(page.people[0].name, 'Capheus');

    const [,,,capheus] = server.db.people;
    assert.equal(capheus.name, 'Capheus');
  });

  ridesPage.visit();
  ridesPage.rides[0].driver.click();
  selectChoose('.driver md-input-container', 'Capheus');

  andThen(() => {
    assert.equal(ridesPage.rides[0].driver.text, 'Capheus');
  });
});

test('people can be made inactive and active', function(assert) {
  page.visit();

  page.people[1].activeSwitch.click();

  andThen(() => {
    assert.equal(page.people.length, 1, 'expected the person made inactive to have disappeared');

    const [sun] = server.db.people;
    assert.notOk(sun.active, 'expected Sun to have been made inactive on the server');
  });

  page.head.inactiveSwitch.click();
  page.people[1].activeSwitch.click();

  andThen(() => {
    const [sun] = server.db.people;
    assert.ok(sun.active, 'expected Sun to have been made active on the server');

    server.patch('/people/:id', {}, 422);
  });

  // FIXME test that inactive people aren’t shown in the ride-person popup

  page.people[1].activeSwitch.click();

  andThen(() => {
    assert.equal(shared.toast.text, 'There was an error saving the active status of Sun');
  });
});

test('person validation errors are displayed', function(assert) {
  server.post('/people', {
      errors: [{
        'source': {
          'pointer': '/data/attributes/name'
        },
        'detail': 'Name can\'t be blank'
      },{
        source: {
          pointer: '/data/attributes/email'
        },
        detail: 'Email can\'t be blank'
      }]
    }, 422);

  page.visit();
  page.newPerson();
  page.form.submit();

  andThen(() => {
    assert.equal(page.form.nameError.text, 'Name can\'t be blank');
    assert.equal(page.form.email.error.text, 'Email can\'t be blank');
  });
});
