import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Route.extend(ApplicationRouteMixin, {
  session: service(),
  account: service(),
  userSocket: service(),
  flashMessages: service(),

  beforeModel() {
    return this._loadCurrentUser();
  },

  title(tokens) {
    return `${tokens.join(' · ')} · Prison Rideshare`;
  },

  sessionAuthenticated() {
    this._super(...arguments);
    this.get('userSocket').connect();
    this._loadCurrentUser();
  },

  _loadCurrentUser() {
    return this.get('account').loadCurrentUser().catch(() => {
      this.get('flashMessages').warning('Please log in');
      this.get('session').invalidate();
    });
  }
});
