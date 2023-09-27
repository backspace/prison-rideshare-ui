import { computed } from '@ember/object';
import Service, { inject as service } from '@ember/service';

export default Service.extend({
  store: service(),

  all: computed(function() {
    return this.store
      .findAll('institution')
      .then(institutions => institutions.sortBy('name'));
  }),
});
