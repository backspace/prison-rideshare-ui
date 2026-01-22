/* eslint-disable ember/no-classic-classes, ember/no-classic-components, ember/no-computed-properties-in-native-classes, ember/require-tagless-components */
import { computed } from '@ember/object';
import Component from '@ember/component';
import reasonToIcon from 'prison-rideshare-ui/utils/reason-to-icon';
import HighCharts from 'ember-highcharts/components/high-charts';

const reasons = Object.keys(reasonToIcon);

export default class CancellationChart extends Component {
  <template>
    <HighCharts
      @content={{this.data}}
      @chartOptions={{this.options}}
      @theme={{this.theme}}
    />
  </template>
  @computed(
    'rides.@each.{cancellationReason,passengers,cancelled,complete,combinedWith}',
    'grouping',
  )
  get reasonToCount() {
    const grouping = this.grouping;
    const rides = this.rides || [];
    const ridesById = new Map(rides.map((ride) => [ride.get('id'), ride]));

    const filteredRides =
      grouping === 'rides'
        ? rides.filter((ride) => !ride.belongsTo('combinedWith').id())
        : rides;

    return filteredRides.reduce((reasonToCount, ride) => {
      const rideAddition = grouping === 'rides' ? 1 : ride.get('passengers');
      const combinedWith =
        grouping === 'passengers' ? ride.belongsTo('combinedWith') : null;
      const parentId = combinedWith?.id();
      const statusRide = parentId
        ? ridesById.get(parentId) || combinedWith.value() || ride
        : ride;

      let key;

      if (statusRide.get('cancelled')) {
        const reason = statusRide.get('cancellationReason');
        if (reasons.includes(reason)) {
          key = reason;
        } else {
          key = 'other';
        }
      } else {
        if (statusRide.get('complete')) {
          key = 'report complete';
        } else {
          key = 'report incomplete';
        }
      }

      if (!reasonToCount[key]) {
        reasonToCount[key] = 0;
      }

      reasonToCount[key] += rideAddition;

      return reasonToCount;
    }, {});
  }

  @computed('reasonToCount')
  get data() {
    const reasonToCount = this.reasonToCount;
    return Object.keys(reasonToCount).map((key) => {
      if (key === 'report complete' || key === 'report incomplete') {
        return {
          name: key,
          data: [reasonToCount[key], 0],
        };
      } else {
        return {
          name: key,
          data: [0, reasonToCount[key]],
        };
      }
    });
  }

  @computed('reasonToCount')
  get options() {
    return {
      chart: {
        type: 'bar',
      },
      title: {
        text: 'Cancellation rate and reasons',
      },
      plotOptions: {
        series: {
          stacking: 'normal',
        },
        bar: {
          dataLabels: {
            enabled: true,
            filter: {
              property: 'y',
              operator: '>',
              value: 5,
            },
          },
        },
      },
      xAxis: {
        categories: ['Not cancelled', 'Cancelled'],
      },
      yAxis: {
        stackLabels: {
          enabled: true,
        },
      },
    };
  }
}
