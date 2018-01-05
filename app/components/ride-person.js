import { computed, getWithDefault } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  peopleService: service('people'),
  people: alias('peopleService.all'),

  person: computed('ride', 'property', 'ride.{carOwner.id,driver.id}', function() {
    return this.get('ride').get(this.get('property'));
  }),

  showContact: false,

  actions: {
    match(option, searchTerm) {
      const name = getWithDefault(option, 'name', '');
      const result = name.toLowerCase().startsWith(searchTerm.toLowerCase());

      return result ? 1 : -1;
    },

    clear() {
      const ride = this.get('ride');
      ride.set(this.get('property'), null);
      return ride.save();
    }
  }
});
