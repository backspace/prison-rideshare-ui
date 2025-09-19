/* eslint-disable ember/no-actions-hash, ember/no-classic-classes, ember/no-get */
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { get } from '@ember/object';

export default Controller.extend({
  session: service(),

  actions: {
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
    },
  },
});
