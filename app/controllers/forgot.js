/* eslint-disable ember/classic-decorator-no-classic-methods */
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

import fetch from 'fetch';

export default class ForgotController extends Controller {
  email = undefined;
  error = undefined;

  @service
  store;

  @service
  toasts;

  @action
  updateEmail(event) {
    const value = event?.target?.value ?? '';

    this.set('email', value);
  }

  @action
  submitForgot(event) {
    event.preventDefault();

    let email = this.email;

    let userAdapter = this.store.adapterFor('user');
    let resetUrl = `${userAdapter.buildURL('user')}/reset?email=${email}`;

    let query = fetch(resetUrl, {
      method: 'POST',
    });

    this.set('error', undefined);

    query
      .then((response) => {
        if (response.ok) {
          this.toasts.show('Check your email');
          return;
        }

        return response.json().then((json) => {
          const message = json?.errors?.[0]?.detail;
          this.set(
            'error',
            message || 'There was an error sending the reset email.',
          );
        });
      })
      .catch(() => {
        this.set('error', 'There was an error sending the reset email.');
      });
  }
}
