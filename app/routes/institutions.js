import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
/* eslint-disable ember/no-classic-classes, ember/no-mixins */
import Route from '@ember/routing/route';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';

@classic
export default class InstitutionsRoute extends Route.extend(AuthenticatedRoute) {
  @service
  store;

  model() {
    return this.store.findAll('institution');
  }

  titleToken = 'Institutions';
}
