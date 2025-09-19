import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers/application-tests';
import { percySnapshot } from 'ember-percy';

import { authenticateSession } from 'ember-simple-auth/test-support';
import { selectChoose } from 'ember-power-select/test-support/helpers';

import page from 'prison-rideshare-ui/tests/pages/people';
import ridesPage from 'prison-rideshare-ui/tests/pages/rides';
import shared from 'prison-rideshare-ui/tests/pages/shared';

module('Acceptance | people', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    const sun = this.server.create('person', {
      name: 'Sun',
      email: 'sun@sense8',
      mobile: '1919',
      landline: '111',
      notes: 'notes?',
      medium: 'email',
    });

    this.server.create('ride', {
      start: new Date(2017, 2, 22),
      driver: sun,
    });

    this.server.create('person', {
      name: 'Kala',
      email: 'kala@sense8',
      mobile: '111',
      medium: 'mobile',
    });

    this.server.create('person', {
      name: 'Will',
      active: false,
      address: '91 Albert',
      email: 'will@sense8',
      mobile: '2019',
    });

    this.server.create('ride');

    await authenticateSession(this.application);
  });

  test('people are listed, with inactive people hidden by default', async function (assert) {
    await page.visit();

    assert.equal(
      page.people.length,
      2,
      'expected the inactive person to be hidden'
    );

    await page.people[1].as((sun) => {
      assert.equal(sun.name, 'Sun');
      assert.equal(sun.email.text, 'sun@sense8');
      assert.equal(sun.email.href, 'mailto:sun@sense8');
      assert.ok(sun.email.isPreferred, 'expected Sun to prefer email');
      assert.equal(sun.landline.text, '111');
      assert.equal(sun.landline.href, 'tel:111');
      assert.equal(sun.lastRide.text, 'March 22, 2017');
      assert.equal(sun.notes.text, 'notes?');
      assert.notOk(sun.copyButton.isVisible);
    });

    assert.ok(
      page.people[0].mobile.isPreferred,
      'expected Kala to prefer mobile'
    );
    assert.equal(
      page.people[0].lastRide.text,
      '',
      'expected someone with no rides to have a blank last ride'
    );

    await page.head.inactiveSwitch.click();

    assert.equal(
      page.people.length,
      3,
      'expected the inactive person to be shown after the switch is flipped'
    );

    assert.ok(page.people[2].copyButton.isVisible);
    assert.equal(page.people[2].copyButton.clipboardText, '91 Albert');

    percySnapshot(assert);
  });

  test('people can be edited, cancelled edits are discarded', async function (assert) {
    await page.visit();

    await page.head.inactiveSwitch.click();

    await page.people[2].edit();

    percySnapshot(assert);

    await page.form.nameField.fill('Billiam');
    await page.form.cancel();

    assert.equal(shared.title, 'Drivers · Prison Rideshare');

    assert.equal(page.people[2].name, 'Will');

    let serverPeople = this.server.db.people;
    let will = serverPeople[serverPeople.length - 1];

    assert.equal(will.name, 'Will');

    await page.people[2].edit();

    assert.equal(page.form.address.field.value, '91 Albert');

    await page.form.nameField.fill('William');

    await page.form.email.field.fillIn('will@sense8');
    await page.form.email.desiredMedium.click();

    await page.form.mobile.field.fillIn('111');
    await page.form.mobile.desiredMedium.click();

    await page.form.notes.field.fillIn('notes.');
    await page.form.submit();

    assert.equal(page.people[2].name, 'William');

    serverPeople = this.server.db.people;
    will = serverPeople[serverPeople.length - 1];

    assert.equal(will.name, 'William');
    assert.equal(will.email, 'will@sense8');
    assert.equal(will.medium, 'mobile');
  });

  test('a person can be created and chosen for a ride', async function (assert) {
    await ridesPage.visit();
    await ridesPage.rides[0].driver.click();

    await page.visit();

    await page.newPerson();

    await page.form.nameField.fill('Capheus');
    await page.form.submit();

    assert.equal(
      page.people.length,
      '3',
      'expected the new person to have been added to the list'
    );
    assert.equal(page.people[0].name, 'Capheus');

    const [, , , capheus] = this.server.db.people;
    assert.equal(capheus.name, 'Capheus');

    await ridesPage.visit();
    await ridesPage.rides[0].driver.click();
    await selectChoose('.driver md-input-container', 'Capheus');

    assert.equal(ridesPage.rides[0].driver.text, 'Capheus');
  });

  test('people can be made inactive and active', async function (assert) {
    await page.visit();

    await page.people[1].activeSwitch.click();

    assert.equal(
      page.people.length,
      1,
      'expected the person made inactive to have disappeared'
    );

    let [sun] = this.server.db.people;
    assert.notOk(
      sun.active,
      'expected Sun to have been made inactive on the server'
    );

    await page.head.inactiveSwitch.click();
    await page.people[1].activeSwitch.click();

    [sun] = this.server.db.people;
    assert.ok(
      sun.active,
      'expected Sun to have been made active on the server'
    );

    this.server.patch('/people/:id', {}, 422);

    // FIXME test that inactive people aren’t shown in the ride-person popup

    await page.people[1].activeSwitch.click();

    assert.equal(
      shared.toast.text,
      'There was an error saving the active status of Sun'
    );
  });

  test('person validation errors are displayed', async function (assert) {
    this.server.post(
      '/people',
      {
        errors: [
          {
            source: {
              pointer: '/data/attributes/name',
            },
            detail: "Name can't be blank",
          },
          {
            source: {
              pointer: '/data/attributes/email',
            },
            detail: "Email can't be blank",
          },
        ],
      },
      422
    );

    await page.visit();
    await page.newPerson();
    await page.form.submit();

    assert.equal(page.form.nameError.text, "Name can't be blank");
    assert.equal(page.form.email.error.text, "Email can't be blank");
  });
});
