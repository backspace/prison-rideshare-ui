import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

import fetch from 'fetch';

export default Controller.extend({
  store: service(),
  toasts: service(),

  actions: {
    submit(event) {
      event.preventDefault();

      let email = this.get('email');

      let userAdapter = this.get('store').adapterFor('user');
      let resetUrl = `${userAdapter.buildURL('user')}/reset?email=${email}`;

      let query = fetch(resetUrl, {
        method: 'POST',
      });

      query.then(() => {
        this.get('toasts').show('Check your email');
      });
    },
  },
});
