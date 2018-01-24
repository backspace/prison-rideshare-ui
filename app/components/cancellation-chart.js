import Component from '@ember/component';
import { computed } from '@ember/object';

import reasonToIcon from 'prison-rideshare-ui/utils/reason-to-icon';

const reasons = Object.keys(reasonToIcon);

export default Component.extend({
  reasonToCount: computed('rides.@each.cancellationReason', function() {
    return this.get('rides').reduce((reasonToCount, ride) => {
      let key;

      if (ride.get('cancelled')) {
        const reason = ride.get('cancellationReason')
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

      reasonToCount[key]++;

      return reasonToCount;
    }, {})
  }),
  data: computed('reasonToCount', function() {
    const reasonToCount = this.get('reasonToCount');
    return Object.keys(reasonToCount).map(key => {
        if (key === 'report complete' || key === 'report incomplete') {
          return {
            name: key,
            data: [reasonToCount[key], 0]
          };
        } else {
          return {
            name: key,
            data: [0, reasonToCount[key]]
          };
        }
      });
  }),
  options: computed('reasonToCount', function() {
    return {
      chart: {
        type: 'bar',
      },
      title: {
        text: 'Cancellations'
      },
      plotOptions: {
        series: {
          stacking: 'normal'
        }
      },
      xAxis: {
        categories: ['Not cancelled', 'Cancelled']
      },
      yAxis: {
      },
    };
  }),
});
