import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import moment from 'moment';

export default Route.extend({
  model({ month }) {
    return RSVP.hash({
      slots: this.store.findAll('slot')
        .then(slots => slots.filter(slot => moment(slot.get('start')).format('YYYY-MM') === month)),
      month
    });
  }
});
