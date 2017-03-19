import Ember from 'ember';
import DS from 'ember-data';

import dollars from 'prison-rideshare-ui/utils/dollars';

export default DS.Model.extend({
  person: DS.belongsTo(),

  rides: DS.hasMany(),

  ridesWithFoodExpenses: Ember.computed('rides.@each.driver', 'person', function() {
    return this.get('rides').filterBy('driver.id', this.get('person.id'));
  }),
  rideFoodExpenses: Ember.computed.mapBy('ridesWithFoodExpenses', 'outstandingFoodExpenses'),
  foodExpenses: Ember.computed.sum('rideFoodExpenses'),
  foodExpensesDollars: dollars('foodExpenses'),

  ridesWithCarExpenses: Ember.computed('rides.@each.carOwner', 'person', function() {
    return this.get('rides').filterBy('carOwner.id', this.get('person.id'));
  }),
  rideCarExpenses: Ember.computed.mapBy('ridesWithCarExpenses', 'outstandingCarExpenses'),
  carExpenses: Ember.computed.sum('rideCarExpenses'),
  carExpensesDollars: dollars('carExpenses'),

  totalExpenses: Ember.computed('foodExpenses', 'carExpenses', function() {
    return this.get('foodExpenses') + this.get('carExpenses');
  }),
  totalExpensesDollars: dollars('totalExpenses')
});
