import Ember from 'ember';

import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  session: Ember.inject.service(),
  account: Ember.inject.service(),
  flashMessages: Ember.inject.service(),

  beforeModel() {
    return this._loadCurrentUser();
  },

  title(tokens) {
    return `${tokens.join(' · ')} · Prison Rideshare`;
  },

  sessionAuthenticated() {
    this._super(...arguments);
    this._loadCurrentUser();
  },

  _loadCurrentUser() {
    return this.get('account').loadCurrentUser().catch(() => {
      this.get('flashMessages').warning('Please log in');
      this.get('session').invalidate();
    });
  }
});
