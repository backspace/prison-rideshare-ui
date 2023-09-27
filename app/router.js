import { inject as service } from '@ember/service';
import EmberRouter from '@ember/routing/router';
import config from 'prison-rideshare-ui/config/environment';

export default class Router extends EmberRouter {
  @service headData;

  location = config.locationType;
  rootURL = config.rootURL;

  setTitle(title) {
    this.get('headData').set('title', title);
  }
}

Router.map(function() {
  this.route('institutions');
  this.route('drivers');
  this.route('debts');
  this.route('reimbursements');
  this.route('rides');

  this.route('reports', function() {
    this.route('new');
  });

  this.route('gas-prices');

  this.route('users');
  this.route('log');

  this.route('login');
  this.route('register');

  this.route('forgot');
  this.route('reset', { path: '/reset/:token' });

  this.route('admin-calendar', { path: '/admin-calendar/:month' });
  this.route('calendar', { path: '/calendar/:month' });

  this.route('statistics');

  this.route('not-found', { path: '/*wildcard' });
});
