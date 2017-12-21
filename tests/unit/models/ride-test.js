import { moduleForModel, test } from 'ember-qunit';
import { run } from "@ember/runloop";

moduleForModel('ride', 'Unit | Model | ride', {
  needs: ['model:institution', 'model:person']
});

test('it determines whether it matches a search query', function(assert) {
  let rockwood;
  let chelsea, edward;

  let rockwoodRide;

  run(() => {
    rockwood = this.store().createRecord('institution', { name: 'Rockwood' });

    chelsea = this.store().createRecord('person', { name: 'Chelsea Manning' });
    edward = this.store().createRecord('person', { name: 'Edward Snowden' });

    rockwoodRide = this.subject({
      institution: rockwood,
      driver: chelsea,
      carOwner: edward,

      name: 'jORTLE',
      address: '91 Albert'
    });
  });

  assert.ok(rockwoodRide.matches('Rock'));
  assert.ok(rockwoodRide.matches('rock'), 'expected institution-matching to ignore case');
  assert.ok(rockwoodRide.matches('ROCK'), 'expected institution-matching to ignore case');
  assert.notOk(rockwoodRide.matches('head'));

  assert.ok(rockwoodRide.matches('edward'));
  assert.ok(rockwoodRide.matches('chelsea'));

  assert.ok(rockwoodRide.matches('jort'));
  assert.ok(rockwoodRide.matches('albert'));

  assert.ok(rockwoodRide.matches('rock snow'), 'expected each word in the query to be matched independently');
});

test('it has readable start and end times', function(assert) {
  const ride = this.subject();

  run(() => {
    ride.set('start', new Date(2010, 5, 26, 13, 0, 0));
    ride.set('end', new Date(2010, 5, 26, 15, 0, 0));
  });

  assert.equal(ride.get('rideTimes'), 'Sat Jun 26 2010 1:00pm — 3:00');
});
