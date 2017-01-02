import Ember from 'ember';
import DS from 'ember-data';

import dollars from 'prison-rideshare-ui/utils/dollars';

import moment from 'moment';

export default DS.Model.extend({
  enabled: DS.attr('boolean', {defaultValue: true}),

  name: DS.attr(),
  institution: DS.belongsTo(),
  address: DS.attr(),
  contact: DS.attr(),
  passengers: DS.attr({defaultValue: 1}),

  start: DS.attr(),
  end: DS.attr(),

  driver: DS.belongsTo('person'),
  carOwner: DS.belongsTo('person'),

  startTime: Ember.computed('date', 'start', timeGetAndSet('start')),
  endTime: Ember.computed('date', 'end', timeGetAndSet('end')),

  distance: DS.attr(),

  foodExpenses: DS.attr({defaultValue: 0}),
  foodExpensesDollars: dollars('foodExpenses'),

  carExpenses: DS.attr({defaultValue: 0}),
  reportNotes: DS.attr(),

  namePlusPassengers: Ember.computed('name', 'passengers', function() {
    const name = this.get('name');
    const passengers = this.get('passengers');

    if (passengers > 1) {
      return `${name} + ${passengers - 1}`;
    } else {
      return name;
    }
  }),

  complete: Ember.computed.gt('distance', 0),
  notComplete: Ember.computed.not('complete')
});

function timeGetAndSet(property) {
  return {
    get() {
      const time = this.get(property);
      return moment(time).format('h:mma');
    },
    set(key, value) {
      const date = this.get('date');
      const dateString = moment(date).format('YYYY-MM-DD');

      // FIXME inefficient, no?
      this.set(property, moment(`${dateString} ${value}`).toDate());
      return value;
    }
  };
}
