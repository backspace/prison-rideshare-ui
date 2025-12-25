/* eslint-disable ember/no-mixins */
import { inject as service } from '@ember/service';
import moment from 'moment-timezone';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';
import CalendarState from 'prison-rideshare-ui/utils/calendar-state';

export default class AdminCalendarRoute extends AuthenticatedRoute {
  @service store;
  @service('people') peopleService;

  async model({ month }) {
    await this.store.findAll('slot');
    const slots = this.store
      .peekAll('slot')
      .filter((slot) => moment(slot.get('start')).format('YYYY-MM') === month);
    await this.peopleService.load();

    return new CalendarState({
      slots,
      month,
    });
  }
}
