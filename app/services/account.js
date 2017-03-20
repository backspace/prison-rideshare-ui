import Ember from 'ember';

import fetch from 'ember-network/fetch';
import config from '../config/environment';

const { inject: { service }, RSVP, Service, isEmpty } = Ember;

// This is mostly taken from the dummy Ember Simple Auth app

export default Service.extend({
  session: service('session'),
  store: service(),

  loadCurrentUser() {
    return new RSVP.Promise((resolve, reject) => {
      const token = this.get('session.data.authenticated.access_token');

      if (!isEmpty(token)) {
        fetch(`${config.DS.host}/${config.DS.namespace}/users/current`, {
          type: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(raw => raw.json(), reject).then(data => {
          const currentUser = this.get('store').push(data);
          this.set('session.currentUser', currentUser);
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
});
