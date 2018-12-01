import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';

import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

import fetch from 'fetch';

export default Service.extend({
  session: service(),
  store: service(),

  overlapsRequest: computed('count', function() {
    let rideAdapter = this.get('store').adapterFor('ride');
    let overlapsUrl = `${rideAdapter.buildURL('ride')}/overlaps`;
    let token = this.get('session.data.authenticated.access_token');

    let query = fetch(overlapsUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return ObjectPromiseProxy.create({
      promise: query.then(response => response.json()).then(response => {
        return { response };
      })
    });
  }),

  overlaps: alias('overlapsRequest.response'),

  count: 0,

  fetch() {
    this.set('count', this.get('count') + 1);
  }
});
