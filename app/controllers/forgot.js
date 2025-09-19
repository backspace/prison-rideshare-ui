/* eslint-disable ember/no-actions-hash, ember/no-classic-classes */
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

import fetch from 'fetch';

export default Controller.extend({
  store: service(),
  toasts: service(),

  actions: {
    submit(event) {
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
    },
  },
});
