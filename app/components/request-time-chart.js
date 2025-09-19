import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';

export default Component.extend({
  classNames: ['request-time-chart'],

  data: computed('rides.@each.start', 'grouping', function () {
    const grouping = this.grouping;

    const data = this.rides
      .reduce((days, ride) => {
        const start = ride.get('start'),
          end = ride.get('end');
        const startInTimeZone = moment.tz(start, 'America/Winnipeg');
        // const day = (startInTimeZone.day() - 1) % 7;
        const day = startInTimeZone.day() ? startInTimeZone.day() - 1 : 6;

        const rideAddition = grouping === 'rides' ? 1 : ride.get('passengers');

        if (!days[day]) {
          days[day] = {
            hours: new Array(24),
            name: startInTimeZone.format('ddd'),
            day,
          };
        }

        let currentHour = startInTimeZone.startOf('hour');

        while (currentHour.isBefore(end)) {
          const hour = currentHour.hour();

          if (!days[day].hours[hour]) {
            days[day].hours[hour] = 0;
          }

          days[day].hours[hour] += rideAddition;

          currentHour = currentHour.add(1, 'hour');
        }

        return days;
      }, new Array(7))
      .reduce((data, day, index) => {
        day.hours.forEach((hourCount, hour) =>
          data.push([hour, index, hourCount || 0])
        );
        return data;
      }, []);

    return [
      {
        name: 'Request starts',
        borderWidth: 1,
        data,
        dataLabels: {
          enabled: true,
          color: '#000000',
        },
      },
    ];
  }),
  options: Object.freeze({
    chart: {
      type: 'heatmap',
      marginTop: 50,
      marginBottom: 80,
      plotBorderWidth: 1,
    },
    title: {
      text: 'Visit times by day',
    },
    xAxis: {
      categories: Array(24)
        .fill()
        .map((empty, index) => index),
    },
    yAxis: {
      categories: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      title: null,
      reversed: true,
      gridLineWidth: 0,
    },
    // FIXME this was in the theme but caused all legends to have a gradient?
    colorAxis: {
      maxColor: '#60042E',
      minColor: '#ffffff',
    },
    plotOptions: {
      heatmap: {
        borderWidth: 0,
      },
    },
    legend: {
      align: 'right',
      layout: 'vertical',
      margin: 0,
      verticalAlign: 'top',
      y: 35,
      symbolHeight: 268,
    },

    tooltip: {
      formatter() {
        let x = this.series.xAxis.categories[this.point.x];
        let y = this.series.yAxis.categories[this.point.y];
        let { value } = this.point;
        return `<strong>${value}</strong> visit${
          value > 1 ? 's' : ''
        } within <strong>${x}h</strong> on <strong>${y}s</strong>`;
      },
    },
  }),
});
