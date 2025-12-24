/* eslint-disable ember/no-mixins, prettier/prettier */
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';

export default class IndexRoute extends AuthenticatedRoute {
  @service account;
  @service router;
  @service session;

  beforeModel() {
    // FIXME this is loading twice, also in application
    return this.account
      .loadCurrentUser()
      .then(() => {
        if (this.session.isAuthenticated && this.session.currentUser?.admin) {
          this.router.transitionTo('rides');
        } else {
          this.router.transitionTo('reports.new');
        }
      })
      .catch(() => this.router.transitionTo('reports.new'));
  }
}
