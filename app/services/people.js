import { computed } from '@ember/object';
import { filterBy } from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';
import DS from 'ember-data';

export default Service.extend({
  store: service(),

  findAll: computed(function() {
    return this.get('store').findAll('person');
  }),

  all: computed('findAll.@each.name', function() {
    return DS.PromiseArray.create({
      promise: this.get('findAll').then(people => people.sortBy('name')),
    });
  }),

  active: filterBy('all', 'active'),
});
