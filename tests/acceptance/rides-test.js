import { test } from 'qunit';
import moduleForAcceptance from 'prison-rideshare-ui/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | rides');

test('list existing rides', function(assert) {
  server.create('ride', {
    name: 'Edward'
  });

  visit('/rides');

  andThen(function() {
    assert.equal(currentURL(), '/rides');

    assert.equal(find('.name').text(), 'Edward');

    assert.equal(find('.date').text(), '2016-12-26');
    assert.equal(find('.times').text(), '8:30pm — 10:00pm');
  });
});
