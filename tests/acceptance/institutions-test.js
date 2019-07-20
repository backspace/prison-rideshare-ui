import { module, test } from 'qunit';
import { setupApplicationTest } from '../helpers/application-tests';
import { percySnapshot } from 'ember-percy';

import { authenticateSession } from 'ember-simple-auth/test-support';

import page from 'prison-rideshare-ui/tests/pages/institutions';
import shared from 'prison-rideshare-ui/tests/pages/shared';

module('Acceptance | institutions', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.server.create('institution', { name: 'Milner Ridge', far: true });
    this.server.create('institution', { name: 'Headingley', far: false });

    authenticateSession(this.application);
  });

  test('institutions can be listed and edited', async function(assert) {
    await page.visit();

    percySnapshot(assert);

    assert.equal(shared.title, 'Institutions · Prison Rideshare');

    assert.equal(
      page.institutions.length,
      2,
      'expected two institutions to be listed'
    );
    assert.equal(page.institutions[0].name, 'Headingley');
    assert.notOk(page.institutions[0].isFar);
    assert.equal(page.institutions[1].name, 'Milner Ridge');
    assert.ok(page.institutions[1].isFar);

    await page.institutions[1].edit();

    percySnapshot(assert);

    await page.form.nameField.fillIn('Morlner Rordge');
    await page.form.cancel();

    let [milnerRidge] = this.server.db.institutions;

    assert.equal(milnerRidge.name, 'Milner Ridge');
    assert.equal(page.institutions[1].name, 'Milner Ridge');

    await page.institutions[1].edit();
    await page.form.nameField.fillIn('Marlner Rardge');
    await page.form.farField.click();
    await page.form.submit();

    [milnerRidge] = this.server.db.institutions;

    assert.equal(milnerRidge.name, 'Marlner Rardge');
    assert.notOk(milnerRidge.far);
  });

  test('institutions can be created', async function(assert) {
    await page.visit();

    await page.newInstitution();

    await page.form.nameField.fillIn('Remand Centre');
    await page.form.farField.click();
    await page.form.submit();

    const [, , remand] = this.server.db.institutions;
    assert.equal(remand.name, 'Remand Centre');
    assert.ok(remand.far);
  });
});
