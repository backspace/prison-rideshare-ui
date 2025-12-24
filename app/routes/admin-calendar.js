/* eslint-disable ember/no-mixins */
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import moment from 'moment-timezone';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';

export default class AdminCalendarRoute extends AuthenticatedRoute {
  @service store;
  @service('people') peopleService;

  async model({ month }) {
    await this.store.findAll('slot');
    const slots = this.store
      .peekAll('slot')
      .filter((slot) => moment(slot.get('start')).format('YYYY-MM') === month);

    return RSVP.hash({
      slots,
      people: this.peopleService.load(),
      month,
    });
  }
}
