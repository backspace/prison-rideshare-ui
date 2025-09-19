import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import Controller from '@ember/controller';
import moment from 'moment';

// Sunset theme adapted from here: https://github.com/highcharts/highcharts/blob/master/js/themes/sunset.js
const theme = {
  colors: ['#FDD089', '#FF7F79', '#A0446E', '#251535'],

  plotOptions: {
    map: {
      nullColor: '#fefefc',
    },
  },

  navigator: {
    series: {
      color: '#FF7F79',
      lineColor: '#A0446E',
    },
  },
};

@classic
export default class StatisticsController extends Controller {
  queryParams = ['start', 'end', 'grouping'];
  grouping = 'rides';

  init() {
    super.init(...arguments);
    this.send('setPastYear');
  }

  theme = theme;

  @computed('model.@each.start', 'start', 'end')
  get rides() {
    const rangeStart = moment(this.start);
    const rangeEnd = moment(this.end);

    return this.model.filter((ride) => {
      return (
        rangeStart.isBefore(ride.get('start')) &&
        rangeEnd.isAfter(ride.get('start'))
      );
    });
  }

  @computed('rides.length')
  get clipboardText() {
    return (
      'date\tinstitution\taddress\tpassengers\tdistance\tfood expenses\treimbursement\n' +
      this.rides
        .rejectBy('cancelled')
        .filterBy('reimbursementExpensesSum')
        .filterBy('complete')
        .sortBy('start')
        .map((ride) => {
          return (
            `${moment(ride.get('start')).format('YYYY-MM-DD')}\t` +
            `${ride.get('institution.name')}\t` +
            `${ride.get('allAnonymisedAddresses')}\t` +
            `${ride.get('allPassengers')}\t` +
            `${ride.get('distance')}\t` +
            `${ride.get('foodExpensesDollars') || ''}\t` +
            `${ride.get('reimbursementExpensesSum') / 100}\t`
          );
        })
        .join('\n')
    );
  }

  @computed('clipboardText')
  get copyButtonTitle() {
    return `This will copy the following to the clipboard:\n${this.clipboardText}`;
  }

  @action
  setPastYear() {
    this.set('start', moment().subtract(1, 'y').format('YYYY-MM-DD'));
    this.set('end', moment().format('YYYY-MM-DD'));
  }

  @action
  setPastTwoWeeks() {
    this.set('start', moment().subtract(2, 'w').format('YYYY-MM-DD'));
    this.set('end', moment().format('YYYY-MM-DD'));
  }

  @action
  setThisYear() {
    this.set('start', moment().startOf('year').format('YYYY-MM-DD'));
    this.set('end', moment().format('YYYY-MM-DD'));
  }
}
