import { mapBy, gt, not } from '@ember/object/computed';
import { computed, get } from '@ember/object';
import DS from 'ember-data';

import dollars from 'prison-rideshare-ui/utils/dollars';
import formatTimespan from 'prison-rideshare-ui/utils/format-timespan';

import sum from 'ember-cpm/macros/sum';
import difference from 'ember-cpm/macros/difference';

import anonymiseAddress from 'prison-rideshare-ui/utils/anonymise-address';

export default DS.Model.extend({
  enabled: DS.attr('boolean', {defaultValue: true}),
  cancellationReason: DS.attr(),

  combinedWith: DS.belongsTo('ride', {inverse: 'children'}),
  children: DS.hasMany('ride', {inverse: 'combinedWith'}),

  isCombined: computed('combinedWith.id', function() {
    return this.belongsTo('combinedWith').id();
  }),

  medium: DS.attr(),

  name: DS.attr(),

  institution: DS.belongsTo(),
  rate: DS.attr('number'),

  address: DS.attr(),
  contact: DS.attr(),
  passengers: DS.attr({defaultValue: 1}),
  firstTime: DS.attr('boolean'),

  validationErrors: computed('errors.[]', function() {
    const attributes = get(this.constructor, 'attributes');

    return attributes._keys.list.reduce((response, key) => {
      const errors = this.get(`errors.${key}`) || [];
      response[key] = errors.mapBy('message');
      return response;
    }, {});
  }),

  start: DS.attr('date'),
  end: DS.attr('date'),
  insertedAt: DS.attr('date'),

  rideTimes: computed('start', 'end', function () {
    const start = this.get('start');
    const end = this.get('end');

    return formatTimespan(start, end);
  }),

  driver: DS.belongsTo('person'),
  carOwner: DS.belongsTo('person'),
  initials: DS.attr('string'),

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

  donation: DS.attr('boolean'),
  donatable: DS.attr('boolean'),

  reimbursementFoodExpenses: mapBy('reimbursements', 'foodExpenses'),
  reimbursementFoodExpensesSum: sum('reimbursementFoodExpenses'),
  outstandingFoodExpenses: difference('foodExpenses', 'reimbursementFoodExpensesSum'),

  reimbursementCarExpenses: mapBy('reimbursements', 'carExpenses'),
  reimbursementCarExpensesSum: sum('reimbursementCarExpenses'),
  outstandingCarExpenses: difference('carExpenses', 'reimbursementCarExpensesSum'),

  reimbursementExpensesSum: computed('reimbursementFoodExpensesSum.[]', 'reimbursementCarExpensesSum.[]', function() {
    return this.get('reimbursementFoodExpensesSum') + this.get('reimbursementCarExpensesSum');
  }),

  outstandingTotalExpenses: sum('outstandingFoodExpenses', 'outstandingCarExpenses'),

  namePlusPassengers: computed('name', 'passengers', function() {
    const name = this.get('name');
    const passengers = this.get('passengers');

    if (passengers > 1) {
      return `${name} + ${passengers - 1}`;
    } else {
      return name;
    }
  }),

  complete: gt('distance', 0),
  notComplete: not('complete'),

  cancelled: computed('enabled', {
    get() {
      return !this.get('enabled');
    },

    set(key, value) {
      this.set('enabled', !value);
      return value;
    }
  }),

  allAnonymisedAddresses: computed('address', 'children.@each.address', function() {
    return [this.get('address')].concat(this.get('children').mapBy('address')).map(address => anonymiseAddress(address)).join(', ');
  }),

  allPassengers: computed('passengers', 'children.@each.passengers', function() {
    return this.get('children').mapBy('passengers').reduce((sum, count) => count + sum, this.get('passengers'));
  }),

  matchString: computed('institution.name', 'driver.name', 'carOwner.name', 'name', 'address', function() {
    return `${this.getWithDefault('institution.name', '')} ${this.getWithDefault('driver.name', '')} ${this.getWithDefault('carOwner.name', '')} ${this.getWithDefault('name', '')} ${this.getWithDefault('address')}`.toLowerCase();
  }),

  matches(casedQuery) {
    const query = casedQuery.toLowerCase();
    const matchString = this.get('matchString');

    return (query.match(/\S+/g) || []).every(queryTerm => matchString.includes(queryTerm));
  }
});
