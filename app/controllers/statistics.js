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

  actions: {
    setPastYear() {
      this.set('start', moment().subtract(1, 'y').format('YYYY-MM-DD'));
      this.set('end', moment().format('YYYY-MM-DD'));
    },

    setPastTwoWeeks() {
      this.set('start', moment().subtract(2, 'w').format('YYYY-MM-DD'));
      this.set('end', moment().format('YYYY-MM-DD'));
    },

    setThisYear() {
      this.set('start', moment().startOf('year').format('YYYY-MM-DD'));
      this.set('end', moment().format('YYYY-MM-DD'));
    }
  }
});
