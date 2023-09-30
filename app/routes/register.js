import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),
  store: service(),

  beforeModel() {
    this.session.prohibitAuthentication();
  },

  model() {
    return this.store.createRecord('user');
  },

  titleToken: 'Register',
});
