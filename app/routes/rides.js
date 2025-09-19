import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';

@classic
export default class RidesRoute extends Route.extend(AuthenticatedRoute) {
  @service
  store;

  model() {
    return this.store.findAll('ride');
  }

  titleToken = 'Rides';
}
