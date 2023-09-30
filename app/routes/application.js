import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  session: service(),
  account: service(),
  userSocket: service(),
  toasts: service(),
  overlaps: service(),
  moment: service(),

  async beforeModel() {
    await this.session.setup();

    this.moment.updateLocale('en', {
      meridiem(hours, minutes, isLower) {
        // Taken from https://github.com/moment/moment/blob/7785323888893428f08eb6d5dc5eb266d5bf2a11/src/lib/units/hour.js#L130
        if (hours > 11) {
          return isLower ? 'p' : 'P';
        } else {
          return isLower ? 'a' : 'A';
        }
      },
    });

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
