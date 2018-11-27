import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';

import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

export default Service.extend({
  store: service(),

  overlapsRequest: computed(function() {
    return ObjectPromiseProxy.create({
      promise: this.get('store').query('ride', { overlaps: true }).then(rides => ({rides}))
    });
  }),

  overlaps: alias('overlapsRequest.rides')
});
