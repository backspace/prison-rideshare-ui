import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import Component from '@ember/component';

import reasonToIcon from 'prison-rideshare-ui/utils/reason-to-icon';

const reasons = Object.keys(reasonToIcon);

@classic
export default class CancellationChart extends Component {
  @computed('rides.@each.cancellationReason', 'grouping')
  get reasonToCount() {
    const grouping = this.grouping;

    return this.rides.reduce((reasonToCount, ride) => {
      const rideAddition = grouping === 'rides' ? 1 : ride.get('passengers');

      let key;

      if (ride.get('cancelled')) {
        const reason = ride.get('cancellationReason');
        if (reasons.includes(reason)) {
          key = reason;
        } else {
          key = 'other';
        }
      } else {
        if (ride.get('complete')) {
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
