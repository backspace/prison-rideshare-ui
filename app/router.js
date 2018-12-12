import { inject as service } from '@ember/service';
import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
  headData: service(),

  setTitle(title) {
    this.get('headData').set('title', title);
  },
});

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

  this.route('admin-calendar', { path: '/admin-calendar/:month' });
  this.route('calendar', { path: '/calendar/:month' });

  this.route('statistics');

  this.route('not-found', { path: '/*wildcard' });
});

export default Router;
