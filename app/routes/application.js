import Ember from 'ember';
import fetch from 'ember-network/fetch';
import config from '../config/environment';

export default Ember.Route.extend({
  session: Ember.inject.service(),

  afterModel() {
    // FIXME unskip this in tests after addressing undefined host
    if (this.get('session').get('isAuthenticated') && !Ember.testing) {
      return fetch(`${config.DS.host}/${config.DS.namespace}/users/current`, {
        type: 'GET',
        headers: {
          'Authorization': `Bearer ${this.get('session').get('session.content.authenticated.access_token')}`
        }
      }).then(raw => raw.json()).then(data => {
        const currentUser = this.store.push(data);
        this.set('session.currentUser', currentUser);
      });
    }
  }
});
