import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  data: computed('rides.@each.start', function() {
    const rides = this.get('rides');
    const cancelled = rides.filterBy('cancelled');
    return [{
      name: 'Requests',
      data: [cancelled.length, rides.length - cancelled.length]
    }];
  }),
  options: Object.freeze({
    chart: {
      type: 'bar',
    },
    title: {
      text: 'Cancellations'
    },
    xAxis: {
      categories: ['Cancelled', 'Not cancelled']
    },
    yAxis: {
      categories: ['Requests'],
    },
  }),
});
