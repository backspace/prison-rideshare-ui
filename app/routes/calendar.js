import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { isEmpty } from '@ember/utils';
import Ember from 'ember';
import fetch from 'fetch';
import config from '../config/environment';

export default Route.extend({
  // FIXME is it possible to get the token from elsewhere than the transition object?
  model(params, { queryParams }) {
    return new RSVP.Promise((resolve, reject) => {
      const token = queryParams.token;
      const personTokenEndpoint = `${(Ember.testing ? '' : config.DS.host)}/${config.DS.namespace}/people/token`;

      if (!isEmpty(token)) {
        fetch(personTokenEndpoint, {
          method: 'POST',
          body: `grant_type=magic&token=${encodeURIComponent(token)}`,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(raw => raw.json(), reject).then(data => {
          localStorage.setItem('person-token', data.access_token);
          resolve();
        }).catch(reject);
      } else {
        resolve();
      }
    }).catch(error => {
      this.set('error', error);
    }).then(() => {
      return RSVP.hash({
        slots: this.store.findAll('slot').catch(() => [
          this.store.createRecord('slot', {start: new Date(2017, 11, 3, 17), end: new Date(2017, 11, 3, 21), count: 2}),
          this.store.createRecord('slot', {start: new Date(2017, 11, 3, 11), end: new Date(2017, 11, 3, 17), count: 3}),
          this.store.createRecord('slot', {start: new Date(2017, 11, 8, 17), count: 4})
        ]),
        person: this.store.queryRecord('person', { me: true, token: localStorage.getItem('person-token') })
      });
    });
  }
});
