/* eslint-disable ember/no-classic-classes, ember/no-get*/
import Model, { belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';

import dollars from 'prison-rideshare-ui/utils/dollars';

export default Model.extend({
  person: belongsTo('person', { async: true, inverse: 'debts' }),

  rides: hasMany('ride', { async: true, inverse: null }),

  descendingRides: computed('rides.@each.start', function () {
    const rides = this.hasMany('rides').value() || [];

    return Array.from(rides).sort((a, b) => b.start - a.start);
  }),

  foodExpenses: computed(
    'person.id',
    'rides.@each.{driver,outstandingFoodExpenses}',
    function () {
      const personId = this.get('person.id');
      const rides = this.hasMany('rides').value() || [];

      return Array.from(rides).reduce((sum, ride) => {
        if (ride.belongsTo('driver').id() !== personId) {
          return sum;
        }

        return sum + ride.outstandingFoodExpenses;
      }, 0);
    },
  ),
  foodExpensesDollars: dollars('foodExpenses'),

  carExpenses: computed(
    'person.id',
    'rides.@each.{carOwner,outstandingCarExpenses}',
    function () {
      const personId = this.get('person.id');
      const rides = this.hasMany('rides').value() || [];

      return Array.from(rides).reduce((sum, ride) => {
        if (ride.belongsTo('carOwner').id() !== personId) {
          return sum;
        }

        return sum + ride.outstandingCarExpenses;
      }, 0);
    },
  ),
  carExpensesDollars: dollars('carExpenses'),

  totalExpenses: computed('foodExpenses', 'carExpenses', function () {
    return this.foodExpenses + this.carExpenses;
  }),
  totalExpensesDollars: dollars('totalExpenses'),
});
