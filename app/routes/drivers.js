import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';

@classic
export default class DriversRoute extends Route.extend(AuthenticatedRoute) {
  @service
  store;

  model() {
    // FIXME this formerly used the people service but it wasn’t getting new records…
    return this.store.findAll('person');
  }

  afterModel() {
    // FIXME this is ridiculous, should just be sync relationships perhaps, or have last ride be computed by API
    return this.store.findAll('ride');
  }

  titleToken = 'Drivers';
}
