import Component from '@ember/component';
import { computed } from '@ember/object';

import moment from 'moment';

export default Component.extend({
  grouping: 'months',

  timeGroups: computed('rides.@each.start', 'grouping', function() {
    return this.get('rides').reduce((timeGroups, ride) => {
      const timeGroupForRide = this.timeGroupForRide(ride);

      if (!timeGroups[timeGroupForRide]) {
        timeGroups[timeGroupForRide] = [];
      }

      timeGroups[timeGroupForRide].push(ride);

      return timeGroups;
    }, {});
  }),

  timeGroupKeys: computed('timeGroups', 'grouping', function() {
    return Object.keys(this.get('timeGroups')).sort()
  }),

  timeGroupForRide(ride) {
    const start = ride.get('start');

    if (this.get('grouping') === 'weeks') {
      return moment(start).startOf('week').format('YYMMDD');
    } else {
      return moment(start).format('YYYY-MM');
    }
  },

  data: computed('timeGroups', function() {
    const timeGroups = this.get('timeGroups');

    return [{
      name: 'Cancelled',
      type: 'column',
      data: this.get('timeGroupKeys').map(timeGroupKey => {
        return timeGroups[timeGroupKey].filterBy('cancelled').length;
      }),
      stack: 'Cancelled'
    }, {
      name: 'Not cancelled',
      type: 'column',
      data: this.get('timeGroupKeys').map(timeGroupKey => {
        return timeGroups[timeGroupKey].rejectBy('cancelled').length;
      }),
      stack: 'Not cancelled'
    }, {
      name: 'Distance',
      type: 'spline',
      yAxis: 1,
      data: this.get('timeGroupKeys').map(timeGroupKey => {
        return timeGroups[timeGroupKey].reduce((sum, ride) => {
          return sum + (ride.get('distance') || 0);
        }, 0);
      })
      }, {
        name: 'Reimbursements',
        type: 'spline',
        yAxis: 2,
        data: this.get('timeGroupKeys').map(timeGroupKey => {
          return timeGroups[timeGroupKey].reduce((sum, ride) => {
            return sum + ride.get('reimbursementFoodExpensesSum') + ride.get('reimbursementCarExpensesSum');
          }, 0)/100;
        })
      }, {
        name: 'Food expenses',
        type: 'spline',
        yAxis: 2,
        data: this.get('timeGroupKeys').map(timeGroupKey => {
          return timeGroups[timeGroupKey].reduce((sum, ride) => {
            return sum + ride.get('reimbursementFoodExpensesSum');
          }, 0)/100;
        })
      }
    ];
  }),

  options: computed('timeGroups', 'timeGroupKeys.length', function() {
    return {
      title: {
        text: 'Period-grouped requests and reimbursements'
      },
      xAxis: [{
        categories: this.get('timeGroupKeys')
      }],
      yAxis:[{
        title: {
          text: 'Requests'
        },
        categxxories: ['Not cancelled', 'Cancelled']
      }, {
        title: {
          text: 'Distance'
        },
        labels: {
          format: '{value}km'
        },
        opposite: true
      }, {
        title: {
          text: 'Reimbursements'
        },
        labels: {
          format: '${value}'
        },
        opposite: true
      }]
    };
  }),
});
