import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),

  titleToken: 'Reset password',

  beforeModel() {
    this.session.prohibitAuthentication();
  },

  model({ token }) {
    return token;
  },

  setupController(controller, model) {
    controller.set('token', model);
  },
});
