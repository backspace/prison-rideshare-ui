import { inject as service } from '@ember/service';
import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
  headData: service(),

  setTitle(title) {
    this.get('headData').set('title', title);
  }
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

  this.route('users');

  this.route('login');
  this.route('register');
});

export default Router;
