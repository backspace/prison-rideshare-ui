import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';
import moment from 'moment';

moduleForModel('ride', 'Unit | Model | ride', {
  needs: ['model:institution', 'model:person', 'model:reimbursement']
});

test('it processes incoming date and times', function(assert) {
  const model = this.subject();

  Ember.run(() => {
    // FIXME this obviously needs to be more flexible
    model.set('date', '2016-12-26');
    model.set('startTime', '23:04');
  });

  const start = model.get('start');
  assert.equal(moment(start).format('YYYY-MM-DD h:mma'), '2016-12-26 11:04pm');

  Ember.run(() => model.set('endTime', '23:22'));

  const end = model.get('end');
  assert.equal(moment(end).format('YYYY-MM-DD h:mma'), '2016-12-26 11:22pm');
});
