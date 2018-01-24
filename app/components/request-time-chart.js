import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';

export default Component.extend({
  data: computed('rides.@each.start', function() {
    const data = this.get('rides').reduce((days, ride) => {
      const start = ride.get('start');
      const startInTimeZone = moment.tz(start, 'America/Winnipeg');
      // const day = (startInTimeZone.day() - 1) % 7;
      const day = startInTimeZone.day() ? startInTimeZone.day() - 1 : 6;

      if (!days[day]) {
        days[day] = {hours: new Array(24), name: startInTimeZone.format('ddd'), day};
      }

      const hour = startInTimeZone.hour();

      if (!days[day].hours[hour]) {
        days[day].hours[hour] = 0;
      }

      days[day].hours[hour] += 1;

      return days;
    }, new Array(7)).reduce((data, day, index) => {
      day.hours.forEach((hourCount, hour) => data.push([hour, index, hourCount || 0]));
      return data;
    }, []);

    return [{
      name: 'Request starts',
      borderWidth: 1,
      data,
      dataLabels: {
        enabled: true,
        color: '#000000'
      }
    }]
  }),
  options: Object.freeze({
    chart: {
      type: 'heatmap',
      marginTop: 50,
      marginBottom: 80,
      plotBorderWidth: 1
    },
    title: {
      text: 'Request start times by day'
    },
    xAxis: {
      categories: Array(24).fill().map((empty, index) => index)
    },
    yAxis: {
      categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      title: null,
      reversed: true
    },
    colorAxis: {
      min: 0,
      minColor: '#ffffff',
      maxColor: '#3f51b5'
    },
    legend: {
      align: 'right',
      layout: 'vertical',
      margin: 0,
      verticalAlign: 'top',
      y: 35,
      symbolHeight: 268
    },

    tooltip: {
      formatter() {
        let x = this.series.xAxis.categories[this.point.x];
        let y = this.series.yAxis.categories[this.point.y];
        let { value } = this.point;
        return `<strong>${value}</strong> request${value > 1 ? 's' : ''} starting at <strong>${x}h</strong> on <strong>${y}</strong>`;
      }
    }
  }),
});
