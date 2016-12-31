import Ember from 'ember';

export default Ember.Route.extend({
  people: Ember.inject.service(),

  model() {
    return this.get('people.all');
  }
});
