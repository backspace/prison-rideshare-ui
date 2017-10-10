import Route from '@ember/routing/route';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
  model() {
    // FIXME this formerly used the people service but it wasn’t getting new records…
    return this.store.findAll('person');
  },

  titleToken: 'Drivers'
});
