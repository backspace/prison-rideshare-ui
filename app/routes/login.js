/* eslint-disable ember/no-classic-classes */
import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),

  beforeModel() {
    this.session.prohibitAuthentication();
  },

  model() {
    const user = {};

    if (window.location.hostname.indexOf('sandbox') > -1) {
      user.email = 'jorts@jants.ca';
      user.password = 'password';
    }

    return EmberObject.create(user);
  },

  titleToken: 'Log in',
});
