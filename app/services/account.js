import RSVP from 'rsvp';
import Service, { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import Ember from 'ember';

import fetch from 'fetch';
import config from '../config/environment';

// This is mostly taken from the dummy Ember Simple Auth app

export default Service.extend({
  session: service('session'),
  store: service(),

  loadCurrentUser() {
    return new RSVP.Promise((resolve, reject) => {
      const token = this.get('session.data.authenticated.access_token');

      if (!isEmpty(token)) {
        fetch(
          `${Ember.testing ? '' : config.DS.host}/${
            config.DS.namespace.length > 0 ? `${config.DS.namespace}/` : ''
          }users/current`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((raw) => raw.json(), reject)
          .then((data) => {
            const currentUser = this.store.push(data);
            this.set('session.currentUser', currentUser);
            resolve();
          })
          .catch(reject);
      } else {
        resolve();
      }
    });
  },
});
