import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class LoginController extends Controller {
  @service session;

  @tracked error;

  @action
  updateEmail(event) {
    const value = event.target.value;
    this.model.email = value;
  }

  @action
  updatePassword(event) {
    const value = event.target.value;
    this.model.password = value;
  }

  @action
  login(event) {
    event.preventDefault();

    const user = this.model;

    this.error = undefined;

    this.session
      .authenticate(
        'authenticator:application',
        user.get('email'),
        user.get('password'),
      )
      .catch((error) => {
        this.error =
          error?.errors?.[0]?.detail ??
          'There was an error logging you in.';
      });
  }
}
