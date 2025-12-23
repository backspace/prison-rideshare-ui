/* eslint-disable ember/no-get */
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { get, action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class RegisterController extends Controller {
  @service session;

  @tracked error;

  @action
  updateEmail(event) {
    const value = event?.target?.value;
    this.model.email = value;
  }

  @action
  updatePassword(event) {
    const value = event?.target?.value;
    this.model.password = value;
  }

  @action
  updatePasswordConfirmation(event) {
    const value = event?.target?.value;
    this.model.passwordConfirmation = value;
  }

  @action
  register(event) {
    event.preventDefault();

    const user = this.model;

    return user
      .save()
      .then(() => {
        return this.session.authenticate(
          'authenticator:application',
          user.get('email'),
          user.get('password'),
        );
      })
      .catch((error) => {
        const errorText =
          get(error, 'errors.firstObject.detail') ??
          'There was an error registering you';
        this.error = errorText;
      });
  }
}
