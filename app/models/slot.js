/* eslint-disable ember/no-classic-classes, ember/no-get*/
import Model, { attr, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';

export default Model.extend({
  start: attr('date'),
  end: attr('date'),
  count: attr('number'),

  commitments: hasMany('commitment', { async: false, inverse: 'slot' }),

  isNotFull: computed('commitments.[]', 'count', function () {
    const count = this.count;
    const commitmentCount = this.get('commitments.length');

    return count === 0 || commitmentCount < count;
  }),
});
