import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class ForgotRoute extends Route {
  @service session;

  beforeModel() {
    this.session.prohibitAuthentication();
  }
}
