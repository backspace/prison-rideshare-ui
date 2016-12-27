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
    assert.equal(find('.start').text(), '2016-12-27T01:30:00.000Z');
  });
});
