import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { get, action } from '@ember/object';

@classic
export default class RegisterController extends Controller {
  @service
  session;

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
          user.get('password')
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
