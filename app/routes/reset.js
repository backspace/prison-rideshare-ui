import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class ResetRoute extends Route {
  @service session;

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
