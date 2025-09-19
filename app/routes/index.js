import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import AuthenticatedRoute from 'prison-rideshare-ui/mixins/authenticated-route';

@classic
export default class IndexRoute extends Route.extend(AuthenticatedRoute) {
  @service
  account;

  @service
  session;

  beforeModel() {
    // FIXME this is loading twice, also in application
    return this.account
      .loadCurrentUser()
      .then(() => {
        if (
          this.get('session.isAuthenticated') &&
          this.get('session.currentUser.admin')
        ) {
          this.transitionTo('rides');
        } else {
          this.transitionTo('reports.new');
        }
      })
      .catch(() => this.transitionTo('reports.new'));
  }
}
