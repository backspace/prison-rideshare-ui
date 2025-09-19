import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import momentAddLocaleShortMeridiemFormat from 'prison-rideshare-ui/utils/moment-add-locale-short-meridiem-format';

@classic
export default class ApplicationRoute extends Route {
  @service
  session;

  @service
  account;

  @service
  userSocket;

  @service
  toasts;

  @service
  overlaps;

  @service
  moment;

  async beforeModel() {
    await this.session.setup();

    momentAddLocaleShortMeridiemFormat(this.moment);

    return this._loadCurrentUser();
  }

  title(tokens) {
    return `${tokens.join(' · ')} · Prison Rideshare`;
  }

  sessionAuthenticated() {
    undefined;
    this.userSocket.connect();
    this.overlaps.fetch();
    this._loadCurrentUser();
  }

  _loadCurrentUser() {
    return this.account.loadCurrentUser().catch(() => {
      this.toasts.show('Please log in');
      this.session.invalidate();
    });
  }
}
