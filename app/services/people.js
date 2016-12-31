import Ember from 'ember';

export default Ember.Service.extend({
  store: Ember.inject.service(),

  all: Ember.computed(function() {
    return this.get('store').findAll('person').then(people => people.sortBy('name'));
  })
});
