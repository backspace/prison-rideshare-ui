/* eslint-disable ember/no-classic-classes, ember/no-classic-components, ember/no-computed-properties-in-native-classes, ember/require-tagless-components */
import { classNames } from '@ember-decorators/component';
import { computed } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import formatTimespan from 'prison-rideshare-ui/utils/format-timespan';
import momentTimeZone from 'moment-timezone';
import HighCharts from 'ember-highcharts/components/high-charts';

const MAX_RIDE_DURATION_HOURS = 24;

const dataLabelFormatter = function () {
  return this.point.value > 0 ? this.point.value : null;
};

@classNames('request-time-chart')
export default class RequestTimeChart extends Component {
  <template>
    <HighCharts
      @content={{this.data}}
      @chartOptions={{this.options}}
      @theme={{this.theme}}
    />

    {{#if this.excludedRides.length}}
      <details class='request-time-exclusions'>
        <summary>
          Rides excluded from visit times chart (duration over
          {{MAX_RIDE_DURATION_HOURS}}
          hours or invalid):
          {{this.excludedRides.length}}
        </summary>
        <ul>
          {{#each this.excludedRidesDisplay as |excluded|}}
            <li>
              {{excluded.timespan}}
              · Visitor:
              {{excluded.visitor}}
              · Driver:
              {{excluded.driver}}
            </li>
          {{/each}}
        </ul>
      </details>
    {{/if}}
  </template>

  @service moment;

  @computed('grouping', 'rides.@each.{end,passengers,start}')
  get data() {
    const grouping = this.grouping;
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const days = dayNames.map((name, day) => ({
      hours: new Array(24).fill(0),
      name,
      day,
    }));

    this.rides.forEach((ride) => {
      const start = ride.get('start');
      const end = ride.get('end');
      if (!start || !end) {
        return;
      }

      const startInTimeZone = momentTimeZone.tz(start, 'America/Winnipeg');
      const endInTimeZone = momentTimeZone.tz(end, 'America/Winnipeg');

      const durationHours = endInTimeZone.diff(startInTimeZone, 'hours', true);

      if (durationHours <= 0 || durationHours > MAX_RIDE_DURATION_HOURS) {
        return;
      }

      const rideAddition = grouping === 'rides' ? 1 : ride.get('passengers');

      let currentHour = startInTimeZone.clone().startOf('hour');

      while (currentHour.isBefore(endInTimeZone)) {
        const hour = currentHour.hour();
        const day = currentHour.day() ? currentHour.day() - 1 : 6;

        days[day].hours[hour] += rideAddition;
        currentHour = currentHour.add(1, 'hour');
      }
    });

    const data = days.reduce((result, day, index) => {
      day.hours.forEach((hourCount, hour) =>
        result.push([hour, index, hourCount || 0]),
      );
      return result;
    }, []);

    return [
      {
        name: 'Request starts',
        borderWidth: 1,
        data,
        dataLabels: {
          enabled: true,
          color: '#000000',
          formatter: dataLabelFormatter,
        },
      },
    ];
  }

  @computed('rides.@each.{start,end}')
  get excludedRides() {
    return (this.rides || []).filter((ride) => {
      const start = ride.get('start');
      const end = ride.get('end');

      if (!start || !end) {
        return true;
      }

      const startInTimeZone = momentTimeZone.tz(start, 'America/Winnipeg');
      const endInTimeZone = momentTimeZone.tz(end, 'America/Winnipeg');
      const durationHours = endInTimeZone.diff(startInTimeZone, 'hours', true);

      return durationHours <= 0 || durationHours > MAX_RIDE_DURATION_HOURS;
    });
  }

  @computed('excludedRides.@each.{start,end,name,driver}')
  get excludedRidesDisplay() {
    return this.excludedRides.map((ride) => {
      const start = ride.get('start');
      const end = ride.get('end');
      const timespan =
        start && end
          ? formatTimespan(this.moment, start, end)
          : start
            ? 'Missing end'
            : 'Missing start';

      return {
        timespan,
        visitor: ride.get('name') || 'Unknown',
        driver: ride.get('driver.name') || 'Unassigned',
      };
    });
  }

  options = Object.freeze({
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
  });
}
