import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Route.extend(UnauthenticatedRouteMixin, {
  model() {
    const user = {};

    if (window.location.hostname.indexOf('sandbox') > -1) {
      user.email = 'jorts@jants.ca';
      user.password = 'password';
    }

    return EmberObject.create(user);
  },

  titleToken: 'Log in'
});
