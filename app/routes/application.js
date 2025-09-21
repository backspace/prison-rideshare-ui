/* eslint-disable ember/no-classic-classes */
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

import momentAddLocaleShortMeridiemFormat from 'prison-rideshare-ui/utils/moment-add-locale-short-meridiem-format';

export default Route.extend({
  session: service(),
  account: service(),
  userSocket: service(),
  toasts: service(),
  overlaps: service(),
  moment: service(),

  async beforeModel() {
    await this.session.setup();

    momentAddLocaleShortMeridiemFormat(this.moment);

    return this._loadCurrentUser();
  },

  title(tokens) {
    return `${tokens.join(' · ')} · Prison Rideshare`;
  },

  sessionAuthenticated() {
    this._super(...arguments);
    this.userSocket.connect();
    this.overlaps.fetch();
    this._loadCurrentUser();
  },

  _loadCurrentUser() {
    return this.account.loadCurrentUser().catch(() => {
      this.toasts.show('Please log in');
      this.session.invalidate();
    });
  },
});
