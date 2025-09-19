import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import { all } from 'rsvp';
import Route from '@ember/routing/route';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';

@classic
export default class ReimbursementsRoute extends Route.extend(AuthenticatedRoute) {
  @service
  store;

  model() {
    return this.store.findAll('reimbursement');
  }

  afterModel(reimbursements) {
    // TODO coalesceFindRequests?
    return all(reimbursements.mapBy('ride'));
  }

  titleToken = 'Reimbursements';
}
