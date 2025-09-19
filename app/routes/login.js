import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import EmberObject from '@ember/object';
import Route from '@ember/routing/route';

@classic
export default class LoginRoute extends Route {
  @service
  session;

  beforeModel() {
    this.session.prohibitAuthentication();
  }

  model() {
    const user = {};

    if (window.location.hostname.indexOf('sandbox') > -1) {
      user.email = 'jorts@jants.ca';
      user.password = 'password';
    }

    return EmberObject.create(user);
  }

  titleToken = 'Log in';
}
