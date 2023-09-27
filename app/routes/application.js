import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  session: service(),
  account: service(),
  userSocket: service(),
  toasts: service(),
  overlaps: service(),

  beforeModel() {
    return this._loadCurrentUser();
  },

  title(tokens) {
    return `${tokens.join(' · ')} · Prison Rideshare`;
  },

  sessionAuthenticated() {
    this._super(...arguments);
    this.get('userSocket').connect();
    this.get('overlaps').fetch();
    this._loadCurrentUser();
  },

  _loadCurrentUser() {
    return this.get('account')
      .loadCurrentUser()
      .catch(() => {
        this.get('toasts').show('Please log in');
        this.get('session').invalidate();
      });
  },
});
