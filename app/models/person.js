/* eslint-disable ember/no-classic-classes*/
import Model, { attr, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';

export default Model.extend({
  name: attr(),

  email: attr('string'),
  mobile: attr('string'),
  landline: attr('string'),
  medium: attr('string'),

  address: attr('string'),

  active: attr('boolean', { defaultValue: true }),

  notes: attr('string'),
  selfNotes: attr('string'),

  reimbursements: hasMany('reimbursement', { async: true, inverse: 'person' }),
  debts: hasMany('debt', { async: true, inverse: 'person' }),

  drivings: hasMany('ride', { async: true, inverse: 'driver' }),
  carOwnings: hasMany('ride', { async: true, inverse: 'carOwner' }),

  lastRide: computed('drivings.@each.start', function () {
    const drivings = this.hasMany('drivings').value() || [];
    const sorted = Array.from(drivings).sort((a, b) => a.start - b.start);

    return sorted[sorted.length - 1];
  }),

  calendarSecret: attr('string'),

  validationErrors: computed(
    'constructor.attributes',
    'errors.[]',
    function () {
      const attributes = this.constructor.attributes;

      return Array.from(attributes.keys()).reduce((response, key) => {
        const errors = this.get(`errors.${key}`) || [];
        response[key] = errors.mapBy('message');
        return response;
      }, {});
    },
  ),
});
