import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  start: DS.attr('date'),
  end: DS.attr('date'),
  count: DS.attr('number'),

  commitments: DS.hasMany({ async: false }),

  isNotFull: computed('commitments.length', 'count', function() {
    const count = this.get('count');
    const commitmentCount = this.get('commitments.length');

    return count === 0 || commitmentCount < count;
  }),
});
