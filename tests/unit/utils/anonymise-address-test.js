import anonymiseAddress from 'prison-rideshare-ui/utils/anonymise-address';
import { module, test } from 'qunit';

module('Unit | Utility | anonymise address', function () {
  test('it masks the street number', function (assert) {
    assert.equal(anonymiseAddress('123 Main St'), '100 block Main St');
  });

  test('it strips leading apartment numbers, even with a #', function (assert) {
    assert.equal(anonymiseAddress('600-123 Main St'), '100 block Main St');
    assert.equal(anonymiseAddress('#600-123 Main St'), '100 block Main St');
  });

  test('it strips trailing bracketed strings', function (assert) {
    assert.equal(
      anonymiseAddress('440 Jorts street (building X unit 666)'),
      '400 block Jorts street'
    );
    assert.equal(
      anonymiseAddress('440 Jorts street (building X unit 666) '),
      '400 block Jorts street'
    );
  });

  test('it strips trailing #-led strings', function (assert) {
    assert.equal(anonymiseAddress('421 osborne #1919'), '400 block osborne');
  });

  test('it strips trailing unit/suite/building identifiers', function (assert) {
    assert.equal(anonymiseAddress('421 osborne apt B'), '400 block osborne');
    assert.equal(anonymiseAddress('421 osborne uNit 33'), '400 block osborne');
    assert.equal(anonymiseAddress('421 osborne suite X'), '400 block osborne');
    assert.equal(
      anonymiseAddress('421 osborne building A suite X'),
      '400 block osborne'
    );
  });
});
