import Controller from '@ember/controller';
import { computed } from '@ember/object';
import moment from 'moment';

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.send('setPastYear');
  },

  rides: computed('model.@each.start', 'start', 'end', function() {
    const rangeStart = moment(this.get('start'));
    const rangeEnd = moment(this.get('end'));

    return this.get('model').filter(ride => {
      return rangeStart.isBefore(ride.get('start')) && rangeEnd.isAfter(ride.get('start'));
    });
  }),

  days: computed('rides.@each.start', function() {
    this.get('rides').reduce((days, ride) => {
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
  }),

  actions: {
    setPastYear() {
      this.set('start', moment().subtract(1, 'y').format('YYYY-MM-DD'));
      this.set('end', moment().format('YYYY-MM-DD'));
    },

    setPastTwoWeeks() {
      this.set('start', moment().subtract(2, 'w').format('YYYY-MM-DD'));
      this.set('end', moment().format('YYYY-MM-DD'));
    }
  }
});
