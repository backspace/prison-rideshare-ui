import { computed, get } from '@ember/object';
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),

  email: DS.attr('string'),
  mobile: DS.attr('string'),
  landline: DS.attr('string'),
  medium: DS.attr('string'),

  address: DS.attr('string'),

  active: DS.attr('boolean', { defaultValue: true }),

  notes: DS.attr('string'),
  selfNotes: DS.attr('string'),

  reimbursements: DS.hasMany(),

  visitings: DS.hasMany('ride', { inverse: 'visitor' }),

  drivings: DS.hasMany('ride', { inverse: 'driver' }),
  carOwnings: DS.hasMany('ride', { inverse: 'carOwner' }),

  lastRide: computed('drivings.@each.start', function() {
    return this.get('drivings')
      .sortBy('start')
      .get('lastObject');
  }),

  calendarSecret: DS.attr('string'),

  validationErrors: computed('errors.[]', function() {
    const attributes = get(this.constructor, 'attributes');

    return Array.from(attributes.keys()).reduce((response, key) => {
      const errors = this.get(`errors.${key}`) || [];
      response[key] = errors.mapBy('message');
      return response;
    }, {});
  }),
});
