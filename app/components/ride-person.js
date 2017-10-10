import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  peopleService: Ember.inject.service('people'),
  people: Ember.computed.alias('peopleService.all'),

  person: Ember.computed('ride', 'property', 'ride.carOwner.id', 'ride.driver.id', function() {
    return this.get('ride').get(this.get('property'));
  }),

  showContact: false,

  actions: {
    match(option, searchTerm) {
      const name = Ember.getWithDefault(option, 'name', '');
      const result = name.toLowerCase().startsWith(searchTerm.toLowerCase());

      return result ? 1 : -1;
    },

    clear() {
      const ride = this.get('ride');
      ride.set(this.get('property'), null);
      return ride.save();
    },

    toggleContact() {
      this.toggleProperty('showContact');
    }
  }
});
