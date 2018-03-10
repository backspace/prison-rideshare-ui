import Controller from '@ember/controller';
import { computed } from '@ember/object';
import moment from 'moment';

import anonymiseAddress from 'prison-rideshare-ui/utils/anonymise-address';

// Sunset theme adapted from here: https://github.com/highcharts/highcharts/blob/master/js/themes/sunset.js
const theme = {
	colors: ['#FDD089', '#FF7F79', '#A0446E', '#251535'],

	plotOptions: {
		map: {
			nullColor: '#fefefc'
		}
	},

	navigator: {
		series: {
			color: '#FF7F79',
			lineColor: '#A0446E'
		}
	}
};


export default Controller.extend({
  init() {
    this._super(...arguments);
    this.send('setPastYear');
  },

  theme,

  rides: computed('model.@each.start', 'start', 'end', function() {
    const rangeStart = moment(this.get('start'));
    const rangeEnd = moment(this.get('end'));

    return this.get('model').filter(ride => {
      return rangeStart.isBefore(ride.get('start')) && rangeEnd.isAfter(ride.get('start'));
    });
  }),

  clipboardText: computed('rides.length', function() {
    return 'date\tinstitution\taddress\tpassengers\tdistance\tfood expenses\treimbursement\n' +
      this.get('rides').rejectBy('cancelled').filterBy('reimbursementExpensesSum').filterBy('complete').sortBy('start').map(ride => {
      return `${moment(ride.get('start')).format('YYYY-MM-DD')}\t` +
        `${ride.get('institution.name')}\t` +
        `${anonymiseAddress(ride.get('address'))}\t` +
        `${ride.get('passengers')}\t` +
        `${ride.get('distance')}\t` +
        `${ride.get('foodExpensesDollars') || ''}\t` +
        `${ride.get('reimbursementExpensesSum')/100}\t`
    }).join('\n');
  }),

  copyButtonTitle: computed('clipboardText', function() {
    return `This will copy the following to the clipboard:\n${this.get('clipboardText')}`;
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
