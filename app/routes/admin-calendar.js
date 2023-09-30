import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import moment from 'moment';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';
import { inject as service } from '@ember/service';

export default Route.extend(AuthenticatedRoute, {
  store: service(),

  model({ month }) {
    return RSVP.hash({
      slots: this.store
        .findAll('slot')
        .then((slots) =>
          slots.filter(
            (slot) => moment(slot.get('start')).format('YYYY-MM') === month
          )
        ),
      month,
    });
  },
});
