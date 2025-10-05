/* eslint-disable ember/no-get */
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { get, action } from '@ember/object';

export default class RegisterController extends Controller {
  @service
  session;

  @action
  updateEmail(valueOrEvent) {
    const value = valueOrEvent?.target?.value ?? valueOrEvent;

    this.model.set('email', value);
  }

  @action
  updatePassword(valueOrEvent) {
    const value = valueOrEvent?.target?.value ?? valueOrEvent;

    this.model.set('password', value);
  }

  @action
  updatePasswordConfirmation(valueOrEvent) {
    const value = valueOrEvent?.target?.value ?? valueOrEvent;

    this.model.set('passwordConfirmation', value);
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
        this.set('error', errorText);
      });
  }
}
