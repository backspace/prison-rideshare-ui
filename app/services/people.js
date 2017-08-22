import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Service.extend({
  store: Ember.inject.service(),

  findAll: Ember.computed(function() {
    return this.get('store').findAll('person');
  }),

  all: Ember.computed('findAll.@each.name', function() {
    return DS.PromiseArray.create({
      promise: this.get('findAll').then(people => people.sortBy('name'))
    });
  })
});
