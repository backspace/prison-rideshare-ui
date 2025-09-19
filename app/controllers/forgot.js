import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

import fetch from 'fetch';

@classic
export default class ForgotController extends Controller {
  @service
  store;

  @service
  toasts;

  @action
  submitForgot(event) {
    event.preventDefault();

    let email = this.email;

    let userAdapter = this.store.adapterFor('user');
    let resetUrl = `${userAdapter.buildURL('user')}/reset?email=${email}`;

    let query = fetch(resetUrl, {
      method: 'POST',
    });

    query.then(() => {
      this.toasts.show('Check your email');
    });
  }
}
