import Controller from '@ember/controller';
import { computed } from '@ember/object';
import moment from 'moment';

export default Controller.extend({
  days: computed('model.@each.start', function() {
    const yearAgoMoment = moment().subtract(1, 'y');

    return this.get('model').filter(ride => {
      return yearAgoMoment.isBefore(ride.get('start'));
    }).reduce((days, ride) => {
      const start = ride.get('start');
      const startInTimeZone = moment.tz(start, 'America/Winnipeg');
      const day = startInTimeZone.day();

      if (!days[day]) {
        days[day] = {hours: new Array(24), name: startInTimeZone.format('ddd')};
      }

      const hour = startInTimeZone.hour();

      if (!days[day].hours[hour]) {
        days[day].hours[hour] = 0;
      }

      days[day].hours[hour] += 1;

      return days;
    }, new Array(7));
  })
});
