import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

@classic
export default class LoginController extends Controller {
  @service
  session;

  @action
  updateEmail(value) {
    this.model.set('email', value);
  }

  @action
  updatePassword(value) {
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
