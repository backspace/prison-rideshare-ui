import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import Ember from 'ember';
import { get } from '@ember/object';
import fetch from 'fetch';
import config from '../config/environment';

export default Route.extend({
  poll: service(),

  model(
    { month },
    {
      to: {
        queryParams: { token },
      },
    }
  ) {
    const personTokenEndpoint = `${Ember.testing ? '' : config.DS.host}/${
      config.DS.namespace
    }/people/token`;

    if (isEmpty(token)) {
      throw new Error('We were unable to log you in without a token.');
    }

    return fetch(personTokenEndpoint, {
      method: 'POST',
      body: `grant_type=magic&token=${encodeURIComponent(token)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then(errorJson => {
          throw errorJson;
        });
      })
      .then(({ access_token }) => {
        localStorage.setItem('person-token', access_token);
        return this.store.queryRecord('person', {
          me: true,
          token: access_token,
        });
      })
      .catch(error => {
        const detail = get(error, 'errors.firstObject.detail');

        if (detail) {
          throw new Error(detail);
        } else {
          throw new Error('We were unable to log you in with that token.');
        }
      })
      .then(person => {
        return RSVP.hash({
          slots: this.store.findAll('slot'),
          person,
          month,
        });
      });
  },

  afterModel() {
    const url = this.store.adapterFor('application').buildURL('slot');

    if (!Ember.testing) {
      this.get('poll').setup({
        name: 'slotsPoll',
        resource_name: 'slots',
        url,
      });
    }
  },

  actions: {
    willTransition(transition) {
      this._super(transition);
      this.get('poll').removePoll('slotsPoll');
    },
  },
});
