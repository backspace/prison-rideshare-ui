import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Model | ride', function(hooks) {
  setupTest(hooks);

  test('it determines whether it matches a search query', function(assert) {
    let rockwood;
    let chelsea, edward;

    let rockwoodRide;

    run(() => {
      rockwood = this.owner
        .lookup('service:store')
        .createRecord('institution', { name: 'Rockwood' });

      chelsea = this.owner
        .lookup('service:store')
        .createRecord('person', { name: 'Chelsea Manning' });
      edward = this.owner
        .lookup('service:store')
        .createRecord('person', { name: 'Edward Snowden' });

      rockwoodRide = run(() =>
        this.owner.lookup('service:store').createRecord('ride', {
          institution: rockwood,
          driver: chelsea,
          carOwner: edward,

          name: 'jORTLE',
          address: '91 Albert',
        })
      );
    });

    assert.ok(rockwoodRide.matches('Rock'));
    assert.ok(
      rockwoodRide.matches('rock'),
      'expected institution-matching to ignore case'
    );
    assert.ok(
      rockwoodRide.matches('ROCK'),
      'expected institution-matching to ignore case'
    );
    assert.notOk(rockwoodRide.matches('head'));

    assert.ok(rockwoodRide.matches('edward'));
    assert.ok(rockwoodRide.matches('chelsea'));

    assert.ok(rockwoodRide.matches('jort'));
    assert.ok(rockwoodRide.matches('albert'));

    assert.ok(
      rockwoodRide.matches('rock snow'),
      'expected each word in the query to be matched independently'
    );
  });
});
