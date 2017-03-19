import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('people');
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
