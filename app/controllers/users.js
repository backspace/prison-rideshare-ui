/* eslint-disable ember/no-actions-hash, ember/no-classic-classes */
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  session: service(),

  actions: {
    updateUserAdmin(user, admin) {
      user.set('admin', admin);
      user.save();
    },
  },
});
