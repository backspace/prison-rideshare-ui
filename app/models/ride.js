import Ember from 'ember';
import DS from 'ember-data';

import dollars from 'prison-rideshare-ui/utils/dollars';

import moment from 'moment';

import sum from 'ember-cpm/macros/sum';
import difference from 'ember-cpm/macros/difference';

export default DS.Model.extend({
  enabled: DS.attr('boolean', {defaultValue: true}),
  cancellationReason: DS.attr(),

  combinedWith: DS.belongsTo('ride', {inverse: 'children'}),
  children: DS.hasMany('ride', {inverse: 'combinedWith'}),

  isCombined: Ember.computed('combinedWith.id', function() {
    return this.belongsTo('combinedWith').id();
  }),

  name: DS.attr(),
  institution: DS.belongsTo(),
  address: DS.attr(),
  contact: DS.attr(),
  passengers: DS.attr({defaultValue: 1}),

  validationErrors: Ember.computed('errors.[]', function() {
    const attributes = Ember.get(this.constructor, 'attributes');

    return attributes._keys.list.reduce((response, key) => {
      const errors = this.get(`errors.${key}`) || [];
      response[key] = errors.mapBy('message');
      return response;
    }, {});
  }),

  start: DS.attr('date'),
  end: DS.attr('date'),

  rideTimes: Ember.computed('start', 'end', function () {
    const start = this.get('start');
    const end = this.get('end');

    return `${moment(start).format('ddd MMM D h:mma')} — ${moment(end).format('h:mm')}`;
  }),

  driver: DS.belongsTo('person'),
  carOwner: DS.belongsTo('person'),

  startTime: Ember.computed('date', 'start', timeGetAndSet('start')),
  endTime: Ember.computed('date', 'end', timeGetAndSet('end')),

  date: Ember.computed('start', {
    get() {
      return moment(this.get('start')).format('YYYY-MM-DD');
    },
    set(key, value) {
      const dateString = moment(value).format('YYYY-MM-DD');

      const time = this.get('start');

      if (time) {
        const timeString = moment(time).format('h:mma');

        this.set('start', moment(`${dateString} ${timeString}`).toDate());
      } else {
        this.set('start', moment(`${dateString}`).toDate());
      }

      return moment(this.get('start')).format('YYYY-MM-DD');
    }
  }),

  requestNotes: DS.attr(),

  distance: DS.attr(),

  reportNotes: DS.attr(),

  reimbursements: DS.hasMany(),

  foodExpenses: DS.attr({defaultValue: 0}),
  foodExpensesDollars: dollars('foodExpenses'),

  carExpenses: DS.attr({defaultValue: 0}),
  carExpensesDollars: dollars('carExpenses'),

  totalExpenses: sum('foodExpenses', 'carExpenses'),
  totalExpensesDollars: dollars('totalExpenses'),

  reimbursementFoodExpenses: Ember.computed.mapBy('reimbursements', 'foodExpenses'),
  reimbursementFoodExpensesSum: Ember.computed.sum('reimbursementFoodExpenses'),
  outstandingFoodExpenses: difference('foodExpenses', 'reimbursementFoodExpensesSum'),

  reimbursementCarExpenses: Ember.computed.mapBy('reimbursements', 'carExpenses'),
  reimbursementCarExpensesSum: Ember.computed.sum('reimbursementCarExpenses'),
  outstandingCarExpenses: difference('carExpenses', 'reimbursementCarExpensesSum'),

  outstandingTotalExpenses: sum('outstandingFoodExpenses', 'outstandingCarExpenses'),

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
      return moment(time).format('HH:mm');
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
