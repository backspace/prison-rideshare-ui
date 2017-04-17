import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  model() {
    const user = {};

    if (window.location.hostname.indexOf('sandbox') > -1) {
      user.email = 'jorts@jants.ca';
      user.password = 'password';
    }

    return Ember.Object.create(user);
  },

  titleToken: 'Log in'
});
