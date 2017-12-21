import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),

  // FIXME is it possible to get the token from elsewhere than the transition object?
  model(params, { queryParams }) {
    return this.get('session').authenticate(
      'authenticator:commitment',
      queryParams.token
    ).catch(error => {
      this.set('error', error);
    }).then(() => {
      return this.store.findAll('slot').catch(() => [
        this.store.createRecord('slot', {start: new Date(2017, 11, 3, 17), end: new Date(2017, 11, 3, 21), count: 2}),
        this.store.createRecord('slot', {start: new Date(2017, 11, 3, 11), end: new Date(2017, 11, 3, 17), count: 3}),
        this.store.createRecord('slot', {start: new Date(2017, 11, 8, 17), count: 4})
      ]);
    });
  }
});
