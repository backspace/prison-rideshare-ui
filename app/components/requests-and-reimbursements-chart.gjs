/* eslint-disable ember/classic-decorator-no-classic-methods, ember/no-classic-classes, ember/no-classic-components, ember/no-computed-properties-in-native-classes, ember/require-tagless-components */
import { action, computed } from '@ember/object';
import { equal } from '@ember/object/computed';
import Component from '@ember/component';
import moment from 'moment-timezone';
import HighCharts from 'ember-highcharts/components/high-charts';

function countRidesOrVisitors(rides, grouping) {
  if (grouping === 'rides') {
    return rides.length;
  } else if (grouping === 'passengers') {
    return rides
      .map((r) => r.passengers)
      .reduce((sum, passengers) => {
        return sum + passengers;
      }, 0);
  }
}

export default class RequestsAndReimbursementsChart extends Component {
  <template>
    <HighCharts
      @content={{this.data}}
      @chartOptions={{this.options}}
      @theme={{this.theme}}
      @callback={{this.afterRenderCallback}}
    />
  </template>

  rendered = false;

  @equal('timeGrouping', 'weeks') isWeeks;
  @equal('timeGrouping', 'months') isMonths;

  @computed('rides.@each.start', 'grouping')
  get timeGroups() {
    return this.rides.reduce((timeGroups, ride) => {
      const timeGroupForRide = this.timeGroupForRide(ride);

      if (!timeGroups[timeGroupForRide]) {
        timeGroups[timeGroupForRide] = [];
      }

      timeGroups[timeGroupForRide].push(ride);

      return timeGroups;
    }, {});
  }

  @computed('timeGroups', 'timeGrouping')
  get timeGroupKeys() {
    return Object.keys(this.timeGroups).sort();
  }

  timeGroupForRide(ride) {
    const start = ride.get('start');

    if (this.timeGrouping === 'weeks') {
      return moment(start).startOf('week').format('YYMMDD');
    } else {
      return moment(start).format('YYYY-MM');
    }
  }

  @computed('grouping', 'timeGroupKeys', 'timeGrouping', 'timeGroups')
  get data() {
    const timeGroups = this.timeGroups;
    const grouping = this.grouping;

    return [
      {
        name: 'Cancelled',
        type: 'column',
        data: this.timeGroupKeys.map((timeGroupKey) => {
          return countRidesOrVisitors(
            timeGroups[timeGroupKey].filter((r) => r.cancelled),
            grouping,
          );
        }),
        stack: 'Requests',
      },
      {
        name: 'Not cancelled',
        type: 'column',
        data: this.timeGroupKeys.map((timeGroupKey) => {
          return countRidesOrVisitors(
            timeGroups[timeGroupKey].filter((r) => !r.cancelled),
            grouping,
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
  }

  @computed('timeGroups', 'timeGroupKeys.length', 'timeGrouping')
  get options() {
    return {
      title: {
        text: `Ride distances and expenses, grouped into months`,
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

  @action
  afterRenderCallback() {
    this.set('rendered', true);
  }
}
