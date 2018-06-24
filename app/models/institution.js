import { computed, get } from '@ember/object';
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  far: DS.attr('boolean'),

  validationErrors: computed('errors.[]', function() {
    const attributes = get(this.constructor, 'attributes');

    return attributes._keys.list.reduce((response, key) => {
      const errors = this.get(`errors.${key}`) || [];
      response[key] = errors.mapBy('message');
      return response;
    }, {});
  })
});
