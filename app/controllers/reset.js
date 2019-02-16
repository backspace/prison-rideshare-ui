import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { get } from '@ember/object';

import fetch from 'fetch';

export default Controller.extend({
  session: service(),
  store: service(),
  toasts: service(),

  actions: {
    submit(event) {
      event.preventDefault();

      let userAdapter = this.get('store').adapterFor('user');
      let resetUrl = `${userAdapter.buildURL('user')}/${this.get('token')}`;

      let query = fetch(resetUrl, {
        method: 'PUT',
        body: JSON.stringify({
          data: {
            type: 'users',
            attributes: {
              password: this.get('password'),
              'password-confirmation': this.get('passwordConfirmation'),
            },
          },
        }),
        headers: {
          'Content-Type': 'application/vnd.api+json',
        },
      });

      query.then(response => {
        if (response.ok) {
          this.get('toasts').show('Changed your password, will now log you in');

          response.json().then(json => {
            let email = get(json, 'data.attributes.email');

            this.get('session').authenticate(
              'authenticator:application',
              email,
              this.get('password')
            );
          });
        } else {
          response.json().then(json => {
            let message = get(json, 'errors.firstObject.detail');

            this.get('toasts').show(message || 'An unknown error occurred');
          });
        }
      });
    },
  },
});
