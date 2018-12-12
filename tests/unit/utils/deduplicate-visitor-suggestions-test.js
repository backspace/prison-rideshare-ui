import deduplicateVisitorSuggestions from 'prison-rideshare-ui/utils/deduplicate-visitor-suggestions';
import { module, test } from 'qunit';

module('Unit | Utility | deduplicate visitor suggestions');

const essun = { name: 'essun', address: 'tirimo', contact: 'oneoneone' };
const Essun = { name: 'Essun', address: 'Tirimo', contact: 'ONEONEONE' };
const essunAtCastrima = {
  name: 'essun',
  address: 'Castrima',
  contact: 'oneoneone',
};

test('it removes elements where the name, address, and contact are identical', function(assert) {
  const result = deduplicateVisitorSuggestions([essun, essun]);
  assert.deepEqual(result, [essun]);
});

test('it ignores case', function(assert) {
  const result = deduplicateVisitorSuggestions([essun, Essun]);
  assert.deepEqual(result, [essun]);
});

test('it keeps elements where the name is the same but the other details are different', function(assert) {
  const result = deduplicateVisitorSuggestions([essun, essunAtCastrima]);
  assert.deepEqual(result, [essun, essunAtCastrima]);
});

test('it truncates at 3 rides', function(assert) {
  const rides = Array.from(new Array(10), (_, index) => {
    return {
      name: `${index}`,
      address: `${index}`,
      contact: `${index}`,
    };
  });
  const result = deduplicateVisitorSuggestions(rides);
  assert.equal(result.length, 3);
});
