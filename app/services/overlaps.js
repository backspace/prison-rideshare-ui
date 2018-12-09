import { computed } from '@ember/object';
import Service, { inject as service } from '@ember/service';

import fetch from 'fetch';
import { task } from 'ember-concurrency';

export default Service.extend({
  session: service(),
  store: service(),

  init() {
    this._super(...arguments);

    this.get('fetchOverlaps').perform();
  },

  fetchOverlaps: task(function * () {
    let rideAdapter = this.get('store').adapterFor('ride');
    let overlapsUrl = `${rideAdapter.buildURL('ride')}/overlaps`.replace('//rides/', '/rides/'); // FIXME ugh
    let token = this.get('session.data.authenticated.access_token');

    let query = fetch(overlapsUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    let response = yield query;
    let json = yield response.json();

    this.set('overlaps', json);
  }),

  count: computed('overlaps.data.length', function() {
    return this.get('overlaps.data.length') || 0;
  }),

  fetch() {
    this.get('fetchOverlaps').perform();
  }
});
