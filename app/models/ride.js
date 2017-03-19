import Ember from 'ember';
import DS from 'ember-data';

import dollars from 'prison-rideshare-ui/utils/dollars';

import moment from 'moment';

export default DS.Model.extend({
  enabled: DS.attr('boolean', {defaultValue: true}),
  cancellationReason: DS.attr(),

  combinedWith: DS.belongsTo('ride', {inverse: 'children'}),
  children: DS.hasMany('ride', {inverse: 'combinedWith'}),

  isCombined: Ember.computed('combinedWith', function() {
    const combinedWithRelationship = this.serialize().data.relationships['combined-with'];
    // FIXME this seems questionable
    return combinedWithRelationship && combinedWithRelationship.data;
  }),

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

  requestNotes: DS.attr(),

  distance: DS.attr(),

  reportNotes: DS.attr(),

  reimbursements: DS.hasMany(),

  foodExpenses: DS.attr({defaultValue: 0}),
  foodExpensesDollars: dollars('foodExpenses'),

  carExpenses: DS.attr({defaultValue: 0}),
  carExpensesDollars: dollars('carExpenses'),

  totalExpenses: Ember.computed('foodExpenses', 'carExpenses', function() {
    return this.get('foodExpenses') + this.get('carExpenses');
  }),
  totalExpensesDollars: dollars('totalExpenses'),

  reimbursementFoodExpenses: Ember.computed.mapBy('reimbursements', 'foodExpenses'),
  reimbursementFoodExpensesSum: Ember.computed.sum('reimbursementFoodExpenses'),
  outstandingFoodExpenses: Ember.computed('reimbursementFoodExpensesSum', 'foodExpenses', function() {
    return this.get('foodExpenses') - this.get('reimbursementFoodExpensesSum');
  }),

  reimbursementCarExpenses: Ember.computed.mapBy('reimbursements', 'carExpenses'),
  reimbursementCarExpensesSum: Ember.computed.sum('reimbursementCarExpenses'),
  outstandingCarExpenses: Ember.computed('reimbursementCarExpensesSum', 'carExpenses', function() {
    return this.get('carExpenses') - this.get('reimbursementCarExpenses');
  }),

  outstandingTotalExpenses: Ember.computed('outstandingFoodExpenses', 'outstandingCarExpenses', function() {
    return this.get('outstandingFoodExpenses') + this.get('outstandingCarExpenses');
  }),

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
  notComplete: Ember.computed.not('complete'),

  cancelled: Ember.computed('enabled', {
    get() {
      return !this.get('enabled');
    },

    set(key, value) {
      this.set('enabled', !value);
      return value;
    }
  })
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
