/* eslint-disable ember/no-classic-classes, ember/no-get*/
import Model, { belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { sort, mapBy } from '@ember/object/computed';

import dollars from 'prison-rideshare-ui/utils/dollars';

export default Model.extend({
  person: belongsTo('person', { async: true, inverse: 'debts' }),

  rides: hasMany('ride', { async: true, inverse: null }),

  descendingRides: sort('rides', 'descendingRideSort'),
  descendingRideSort: Object.freeze(['start:desc']),

  ridesWithFoodExpenses: computed(
    'person.id',
    'rides.@each.driver',
    function () {
      return this.rides.filterBy('driver.id', this.get('person.id'));
    },
  ),
  rideFoodExpenses: mapBy('ridesWithFoodExpenses', 'outstandingFoodExpenses'),
  foodExpenses: computed('rideFoodExpenses', function () {
    return this.rideFoodExpenses.reduce((sum, amount) => sum + amount, 0);
  }),
  foodExpensesDollars: dollars('foodExpenses'),

  ridesWithCarExpenses: computed(
    'person.id',
    'rides.@each.carOwner',
    function () {
      return this.rides.filterBy('carOwner.id', this.get('person.id'));
    },
  ),
  rideCarExpenses: mapBy('ridesWithCarExpenses', 'outstandingCarExpenses'),
  carExpenses: computed('rideCarExpenses', function () {
    return this.rideCarExpenses.reduce((sum, amount) => sum + amount, 0);
  }),
  carExpensesDollars: dollars('carExpenses'),

  totalExpenses: computed('foodExpenses', 'carExpenses', function () {
    return this.foodExpenses + this.carExpenses;
  }),
  totalExpensesDollars: dollars('totalExpenses'),
});
