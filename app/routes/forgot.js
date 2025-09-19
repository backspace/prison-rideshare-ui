import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

@classic
export default class ForgotRoute extends Route {
  @service
  session;

  titleToken = 'Forgot password';

  beforeModel() {
    this.session.prohibitAuthentication();
  }
}
