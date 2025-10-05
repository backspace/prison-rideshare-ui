import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default class LoginController extends Controller {
  @service
  session;

  @action
  updateEmail(event) {
    const value = event.target.value;

    this.model.set('email', value);
  }

  @action
  updatePassword(event) {
    const value = event.target.value;

    this.model.set('password', value);
  }

  @action
  login(event) {
    event.preventDefault();

    const user = this.model;

    this.session
      .authenticate(
        'authenticator:application',
        user.get('email'),
        user.get('password'),
      )
      .catch((error) => {
        this.set('error', error);
      });
  }
}
