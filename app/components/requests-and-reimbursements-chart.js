/* eslint-disable ember/no-actions-hash, ember/no-classic-classes, ember/no-classic-components, ember/require-tagless-components */
import Component from '@ember/component';
import { computed } from '@ember/object';

import moment from 'moment';

function countRidesOrVisitors(rides, grouping) {
  if (grouping === 'rides') {
    return rides.length;
  } else if (grouping === 'passengers') {
    return rides.mapBy('passengers').reduce((sum, passengers) => {
      return sum + passengers;
    }, 0);
  }
}

export default Component.extend({
  grouping: 'months',
  rendered: false,

  timeGroups: computed('rides.@each.start', 'grouping', function () {
    return this.rides.reduce((timeGroups, ride) => {
      const timeGroupForRide = this.timeGroupForRide(ride);

      if (!timeGroups[timeGroupForRide]) {
        timeGroups[timeGroupForRide] = [];
      }

      timeGroups[timeGroupForRide].push(ride);

      return timeGroups;
    }, {});
  }),

  timeGroupKeys: computed('timeGroups', 'grouping', function () {
    return Object.keys(this.timeGroups).sort();
  }),

  timeGroupForRide(ride) {
    const start = ride.get('start');

    if (this.grouping === 'weeks') {
      return moment(start).startOf('week').format('YYMMDD');
    } else {
      return moment(start).format('YYYY-MM');
    }
  },

  data: computed('grouping', 'timeGroupKeys', 'timeGroups', function () {
    const timeGroups = this.timeGroups;
    const grouping = this.grouping;

    return [
      {
        name: 'Cancelled',
        type: 'column',
        data: this.timeGroupKeys.map((timeGroupKey) => {
          return countRidesOrVisitors(
            timeGroups[timeGroupKey].filterBy('cancelled'),
            grouping
          );
        }),
        stack: 'Requests',
      },
      {
        name: 'Not cancelled',
        type: 'column',
        data: this.timeGroupKeys.map((timeGroupKey) => {
          return countRidesOrVisitors(
            timeGroups[timeGroupKey].rejectBy('cancelled'),
            grouping
          );
        }),
        stack: 'Requests',
      },
      {
        name: 'Distance',
        type: 'spline',
        yAxis: 1,
        data: this.timeGroupKeys.map((timeGroupKey) => {
          return timeGroups[timeGroupKey].reduce((sum, ride) => {
            return sum + (ride.get('distance') || 0);
          }, 0);
        }),
      },
      {
        name: 'Reimbursements',
        type: 'spline',
        yAxis: 2,
        data: this.timeGroupKeys.map((timeGroupKey) => {
          return (
            timeGroups[timeGroupKey].reduce((sum, ride) => {
              return (
                sum +
                ride.get('reimbursementFoodExpensesSum') +
                ride.get('reimbursementCarExpensesSum')
              );
            }, 0) / 100
          );
        }),
      },
      {
        name: 'Food expenses',
        type: 'spline',
        yAxis: 2,
        data: this.timeGroupKeys.map((timeGroupKey) => {
          return (
            timeGroups[timeGroupKey].reduce((sum, ride) => {
              return sum + ride.get('reimbursementFoodExpensesSum');
            }, 0) / 100
          );
        }),
      },
    ];
  }),

  options: computed(
    'timeGroups',
    'timeGroupKeys.length',
    'grouping',
    function () {
      return {
        title: {
          text: `Ride distances and expenses, grouped into <span id='grouping-months'></span> or <span id='grouping-weeks'>(broken time axis)</span>`,
          useHTML: true,
        },
        plotOptions: {
          column: {
            stacking: 'normal',
          },
        },
        xAxis: [
          {
            categories: this.timeGroupKeys,
          },
        ],
        yAxis: [
          {
            title: {
              text: 'Requests',
            },
          },
          {
            title: {
              text: 'Distance',
            },
            labels: {
              format: '{value}km',
            },
            opposite: true,
          },
          {
            title: {
              text: 'Reimbursements',
            },
            labels: {
              format: '${value}',
            },
            opposite: true,
          },
        ],
      };
    }
  ),

  actions: {
    afterRenderCallback() {
      this.set('rendered', true);
    },
  },
});
