import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

import { authenticateSession } from 'prison-rideshare-ui/tests/helpers/ember-simple-auth';

import page from 'prison-rideshare-ui/tests/pages/institutions';
import shared from 'prison-rideshare-ui/tests/pages/shared';

moduleForAcceptance('Acceptance | institutions', {
  beforeEach() {
    server.create('institution', {name: 'Milner Ridge', far: true});
    server.create('institution', {name: 'Headingley', far: false});

    authenticateSession(this.application);
  }
});

test('institutions can be listed and edited', function(assert) {
  page.visit();

  andThen(() => {
    assert.equal(shared.title, 'Institutions · Prison Rideshare');

    assert.equal(page.institutions.length, 2, 'expected two institutions to be listed');
    assert.equal(page.institutions[0].name, 'Headingley');
    assert.notOk(page.institutions[0].isFar);
    assert.equal(page.institutions[1].name, 'Milner Ridge');
    assert.ok(page.institutions[1].isFar);
  });

  page.institutions[1].edit();
  page.form.nameField.fillIn('Morlner Rordge');
  page.form.cancel();

  andThen(() => {
    const [milnerRidge] = server.db.institutions;

    assert.equal(milnerRidge.name, 'Milner Ridge');
    assert.equal(page.institutions[1].name, 'Milner Ridge');
  });

  page.institutions[1].edit();
  page.form.nameField.fillIn('Marlner Rardge');
  page.form.farField.click();
  page.form.submit();

  andThen(() => {
    const [milnerRidge] = server.db.institutions;

    assert.equal(milnerRidge.name, 'Marlner Rardge');
    assert.notOk(milnerRidge.far);
  });
});

test('institutions can be created', function(assert) {
  page.visit();

  page.newInstitution();

  page.form.nameField.fillIn('Remand Centre');
  page.form.farField.click();
  page.form.submit();

  andThen(() => {
    const [, , remand] = server.db.institutions;
    assert.equal(remand.name, 'Remand Centre');
    assert.ok(remand.far);
  });
});
