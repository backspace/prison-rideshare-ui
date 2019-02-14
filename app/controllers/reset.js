import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { get } from '@ember/object';

import fetch from 'fetch';

export default Controller.extend({
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
          this.get('toasts').show('FIXME It worked?');
        } else {
          response.json().then(json => {
            this.get('toasts').show(get(json, 'errors.firstObject.detail'));
          });
        }
      });
    },
  },
});
