import { moduleForModel, test } from 'ember-qunit';

moduleForModel('person', 'Unit | Model | person', {
  // Specify the other units that are required for this test.
  needs: ['model:reimbursement', 'model:ride']
});

test('it determines initials', function(assert) {
  assert.equal(this.subject({ name: ' francine pascal ' }).get('initials'), 'FP');
});

test('initials handles empty names', function(assert) {
  assert.equal(this.subject().get('initials'), '??');
});

test('initials handles blank names', function(assert) {
  assert.equal(this.subject({ name: '' }).get('initials'), '??');
});

test('initials treats hypens as whitespace', function(assert) {
  assert.equal(this.subject({ name: 'a hyphenated-name' }).get('initials'), 'AHN');
});
