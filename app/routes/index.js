import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
  account: service(),
  session: service(),

  beforeModel() {
    // FIXME this is loading twice, also in application
    return this.get('account').loadCurrentUser().then(() => {
      if (this.get('session.isAuthenticated') && this.get('session.currentUser.admin')) {
        this.transitionTo('rides');
      } else {
        this.transitionTo('reports.new');
      }
    });
  }
});
