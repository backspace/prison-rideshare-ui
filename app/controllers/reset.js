import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { get, action } from '@ember/object';

import fetch from 'fetch';

@classic
export default class ResetController extends Controller {
  @service
  session;

  @service
  store;

  @service
  toasts;

  @action
  submitReset(event) {
    event.preventDefault();

    let userAdapter = this.store.adapterFor('user');
    let resetUrl = `${userAdapter.buildURL('user')}/${this.token}`;

    let query = fetch(resetUrl, {
      method: 'PUT',
      body: JSON.stringify({
        data: {
          type: 'users',
          attributes: {
            password: this.password,
            'password-confirmation': this.passwordConfirmation,
          },
        },
      }),
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
    });

    query.then((response) => {
      if (response.ok) {
        this.toasts.show('Changed your password, will now log you in');

        response.json().then((json) => {
          let email = get(json, 'data.attributes.email');

          this.session.authenticate(
            'authenticator:application',
            email,
            this.password
          );
        });
      } else {
        response.json().then((json) => {
          let message = get(json, 'errors.firstObject.detail');

          this.toasts.show(message || 'An unknown error occurred');
        });
      }
    });
  }
}
