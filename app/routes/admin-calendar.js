/* eslint-disable ember/no-mixins */
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import moment from 'moment-timezone';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';

export default class AdminCalendarRoute extends AuthenticatedRoute {
  @service store;

  model({ month }) {
    return RSVP.hash({
      slots: this.store
        .findAll('slot')
        .then((slots) =>
          slots.filter(
            (slot) => moment(slot.get('start')).format('YYYY-MM') === month,
          ),
        ),
      month,
    });
  }
}
