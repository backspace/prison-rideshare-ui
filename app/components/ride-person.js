import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  peopleService: Ember.inject.service('people'),
  people: Ember.computed.alias('peopleService.all'),

  actions: {
    match(option, searchTerm) {
      const name = Ember.get(option, 'name');
      const result = (name || '').toLowerCase().startsWith(searchTerm.toLowerCase());

      return result ? 1 : -1;
    }
  }
});
