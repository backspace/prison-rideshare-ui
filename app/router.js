import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL,
  headData: Ember.inject.service(),

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
