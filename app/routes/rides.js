import Route from '@ember/routing/route';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';
import { inject as service } from '@ember/service';

export default Route.extend(AuthenticatedRoute, {
  store: service(),

  model() {
    return this.store.findAll('ride');
  },

  titleToken: 'Rides',
});
