/* eslint-disable ember/no-classic-classes, ember/no-mixins */
import Route from '@ember/routing/route';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';
import { inject as service } from '@ember/service';

export default Route.extend(AuthenticatedRoute, {
  store: service(),

  model() {
    // FIXME this formerly used the people service but it wasn’t getting new records…
    return this.store.findAll('person');
  },

  afterModel() {
    // FIXME this is ridiculous, should just be sync relationships perhaps, or have last ride be computed by API
    return this.store.findAll('ride');
  },

  titleToken: 'Drivers',
});
