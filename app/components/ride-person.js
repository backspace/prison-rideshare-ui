import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  peopleService: service('people'),
  people: alias('peopleService.active'),

  person: computed(
    'ride',
    'property',
    'ride.{carOwner.id,driver.id}',
    function() {
      return this.get('ride').get(this.get('property'));
    }
  ),

  showContact: false,

  actions: {
    clear() {
      const ride = this.get('ride');
      ride.set(this.get('property'), null);
      return ride.save();
    },
  },
});
