import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  session: service(),

  actions: {
    login(event) {
      event.preventDefault();

      const user = this.model;

      this.session
        .authenticate(
          'authenticator:application',
          user.get('email'),
          user.get('password')
        )
        .catch(error => {
          this.set('error', error);
        });
    },
  },
});
