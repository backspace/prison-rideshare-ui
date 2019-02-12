import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Route.extend(UnauthenticatedRouteMixin, {
  titleToken: 'Reset password',

  model({ token }) {
    return token;
  },

  setupController(controller, model) {
    controller.set('token', model);
  },
});
