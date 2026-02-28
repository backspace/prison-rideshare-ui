/* eslint-disable ember/classic-decorator-no-classic-methods, ember/no-classic-classes, ember/no-classic-components, ember/no-computed-properties-in-native-classes, ember/require-tagless-components */
import { action, computed } from '@ember/object';
import { equal } from '@ember/object/computed';
import Component from '@ember/component';
import moment from 'moment-timezone';
import HighCharts from 'ember-highcharts/components/high-charts';

const MAX_RIDE_DURATION_HOURS = 24;

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

function rideStatusForVisitHours(ride, ridesById) {
  const combinedWith = ride.belongsTo('combinedWith');
  const parentId = combinedWith?.id();

  if (!parentId) {
    return ride;
  }

  return ridesById.get(parentId) || combinedWith.value() || ride;
}

function visitHoursForRide(ride, grouping, ridesById) {
  const statusRide = rideStatusForVisitHours(ride, ridesById);

  if (ride.get('cancelled') || statusRide.get('cancelled')) {
    return 0;
  }

  const start = ride.get('start');
  const end = ride.get('end');

  if (!start || !end) {
    return 0;
  }

  const durationHours = moment(end).diff(start, 'hours', true);

  if (
    !Number.isFinite(durationHours) ||
    durationHours <= 0 ||
    durationHours > MAX_RIDE_DURATION_HOURS
  ) {
    return 0;
  }

  const multiplier = grouping === 'passengers' ? ride.get('passengers') : 1;
  return durationHours * multiplier;
}

export default class RequestsAndReimbursementsChart extends Component {
  <template>
    <HighCharts
      @content={{this.data}}
      @chartOptions={{this.options}}
      @theme={{this.theme}}
      @callback={{this.afterRenderCallback}}
    />
    <div class='chart-addendum'>
      <div>Total distance: {{this.totalDistanceDisplay}} km</div>
      <div>Total visit hours (excluding long visits with separate dropoff and
        pickup rides):
        {{this.totalVisitHoursDisplay}}
        hours</div>
      <div>Total reimbursements: ${{this.totalReimbursementsDisplay}}</div>
      <div>Total food expenses: ${{this.totalFoodExpensesDisplay}}</div>
    </div>
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

  @computed(
    'grouping',
    'rides.@each.{start,end,passengers,cancelled,combinedWith}',
    'timeGroupKeys',
    'timeGroups',
  )
  get visitHoursByTimeGroup() {
    const grouping = this.grouping;
    const rides = this.rides || [];
    const ridesById = new Map(rides.map((ride) => [ride.get('id'), ride]));

    return this.timeGroupKeys.map((timeGroupKey) => {
      return (this.timeGroups[timeGroupKey] || []).reduce((sum, ride) => {
        return sum + visitHoursForRide(ride, grouping, ridesById);
      }, 0);
    });
  }

  timeGroupForRide(ride) {
    const start = ride.get('start');

    if (this.timeGrouping === 'weeks') {
      return moment(start).startOf('week').format('YYMMDD');
    } else {
      return moment(start).format('YYYY-MM');
    }
  }

  @computed(
    'grouping',
    'timeGroupKeys',
    'timeGrouping',
    'timeGroups',
    'visitHoursByTimeGroup',
  )
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
        name: 'Visit hours',
        type: 'spline',
        yAxis: 3,
        data: this.visitHoursByTimeGroup,
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
        {
          title: {
            text: 'Visit hours',
          },
          labels: {
            format: '{value}h',
          },
        },
      ],
    };
  }

  @computed('rides.@each.distance')
  get totalDistance() {
    return (this.rides || []).reduce((sum, ride) => {
      return sum + (ride.get('distance') || 0);
    }, 0);
  }

  @computed(
    'rides.@each.{reimbursementFoodExpensesSum,reimbursementCarExpensesSum}',
  )
  get totalReimbursements() {
    return (
      (this.rides || []).reduce((sum, ride) => {
        return (
          sum +
          ride.get('reimbursementFoodExpensesSum') +
          ride.get('reimbursementCarExpensesSum')
        );
      }, 0) / 100
    );
  }

  @computed('rides.@each.reimbursementFoodExpensesSum')
  get totalFoodExpenses() {
    return (
      (this.rides || []).reduce((sum, ride) => {
        return sum + ride.get('reimbursementFoodExpensesSum');
      }, 0) / 100
    );
  }

  @computed(
    'grouping',
    'rides.@each.{start,end,passengers,cancelled,combinedWith}',
  )
  get totalVisitHours() {
    const rides = this.rides || [];
    const ridesById = new Map(rides.map((ride) => [ride.get('id'), ride]));

    return rides.reduce((sum, ride) => {
      return sum + visitHoursForRide(ride, this.grouping, ridesById);
    }, 0);
  }

  @computed('totalDistance')
  get totalDistanceDisplay() {
    return this.formatNumber(this.totalDistance, 1);
  }

  @computed('totalReimbursements')
  get totalReimbursementsDisplay() {
    return this.formatNumber(this.totalReimbursements, 2);
  }

  @computed('totalFoodExpenses')
  get totalFoodExpensesDisplay() {
    return this.formatNumber(this.totalFoodExpenses, 2);
  }

  @computed('totalVisitHours')
  get totalVisitHoursDisplay() {
    return this.formatNumber(this.totalVisitHours, 1);
  }

  formatNumber(value, fractionDigits) {
    if (!Number.isFinite(value)) {
      return '0';
    }

    return value.toFixed(fractionDigits);
  }

  @action
  afterRenderCallback() {
    this.set('rendered', true);
  }
}
