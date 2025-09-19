/* eslint-disable ember/no-classic-classes */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service(),

  model() {
    return this.store.findAll('ride', { reload: true });
  },

  titleToken: 'Ride report',
});
