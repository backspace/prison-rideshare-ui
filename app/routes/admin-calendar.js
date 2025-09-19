import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import moment from 'moment';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';

@classic
export default class AdminCalendarRoute extends Route.extend(AuthenticatedRoute) {
  @service
  store;

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
  }
}
