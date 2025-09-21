/* eslint-disable ember/no-get, ember/no-new-mixins */
import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  router: service(),
  session: service(),

  beforeModel() {
    if (!this.get('session.isAuthenticated')) {
      this.router.transitionTo('login');
    }
  },
});
