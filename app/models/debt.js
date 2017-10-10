import { computed } from '@ember/object';
import { sort, mapBy } from '@ember/object/computed';
import DS from 'ember-data';

import dollars from 'prison-rideshare-ui/utils/dollars';

import sum from 'ember-cpm/macros/sum';

export default DS.Model.extend({
  person: DS.belongsTo(),

  rides: DS.hasMany(),

  descendingRides: sort('rides', 'descendingRideSort'),
  descendingRideSort: ['start:desc'],

  ridesWithFoodExpenses: computed('rides.@each.driver', 'person', function() {
    return this.get('rides').filterBy('driver.id', this.get('person.id'));
  }),
  rideFoodExpenses: mapBy('ridesWithFoodExpenses', 'outstandingFoodExpenses'),
  foodExpenses: sum('rideFoodExpenses'),
  foodExpensesDollars: dollars('foodExpenses'),

  ridesWithCarExpenses: computed('rides.@each.carOwner', 'person', function() {
    return this.get('rides').filterBy('carOwner.id', this.get('person.id'));
  }),
  rideCarExpenses: mapBy('ridesWithCarExpenses', 'outstandingCarExpenses'),
  carExpenses: sum('rideCarExpenses'),
  carExpensesDollars: dollars('carExpenses'),

  totalExpenses: sum('foodExpenses', 'carExpenses'),
  totalExpensesDollars: dollars('totalExpenses')
});
