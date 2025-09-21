/* eslint-disable ember/no-classic-classes, ember/no-get*/
import Model, { belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { sort, mapBy } from '@ember/object/computed';

import dollars from 'prison-rideshare-ui/utils/dollars';

import sum from 'ember-cpm/macros/sum';

export default Model.extend({
  person: belongsTo(),

  rides: hasMany(),

  descendingRides: sort('rides', 'descendingRideSort'),
  descendingRideSort: Object.freeze(['start:desc']),

  ridesWithFoodExpenses: computed(
    'person.id',
    'rides.@each.driver',
    function () {
      return this.rides.filterBy('driver.id', this.get('person.id'));
    }
  ),
  rideFoodExpenses: mapBy('ridesWithFoodExpenses', 'outstandingFoodExpenses'),
  foodExpenses: sum('rideFoodExpenses'),
  foodExpensesDollars: dollars('foodExpenses'),

  ridesWithCarExpenses: computed(
    'person.id',
    'rides.@each.carOwner',
    function () {
      return this.rides.filterBy('carOwner.id', this.get('person.id'));
    }
  ),
  rideCarExpenses: mapBy('ridesWithCarExpenses', 'outstandingCarExpenses'),
  carExpenses: sum('rideCarExpenses'),
  carExpensesDollars: dollars('carExpenses'),

  totalExpenses: sum('foodExpenses', 'carExpenses'),
  totalExpensesDollars: dollars('totalExpenses'),
});
