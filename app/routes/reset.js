import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

@classic
export default class ResetRoute extends Route {
  @service
  session;

  titleToken = 'Reset password';

  beforeModel() {
    this.session.prohibitAuthentication();
  }

  model({ token }) {
    return token;
  }

  setupController(controller, model) {
    controller.set('token', model);
  }
}
