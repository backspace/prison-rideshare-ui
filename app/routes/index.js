/* eslint-disable ember/no-classic-classes, ember/no-get, ember/no-mixins */
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
  account: service(),
  router: service(),
  session: service(),

  beforeModel() {
    // FIXME this is loading twice, also in application
    return this.account
      .loadCurrentUser()
      .then(() => {
        if (
          this.get('session.isAuthenticated') &&
          this.get('session.currentUser.admin')
        ) {
          this.router.transitionTo('rides');
        } else {
          this.router.transitionTo('reports.new');
        }
      })
      .catch(() => this.router.transitionTo('reports.new'));
  },
});
