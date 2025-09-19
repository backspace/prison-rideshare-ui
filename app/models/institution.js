/* eslint-disable ember/no-classic-classes, ember/use-ember-data-rfc-395-imports, no-unused-vars */
import { computed, get } from '@ember/object';
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  far: DS.attr('boolean'),

  validationErrors: computed(
    'constructor.attributes',
    'errors.[]',
    function () {
      const attributes = this.constructor.attributes;

      return Array.from(attributes.keys()).reduce((response, key) => {
        const errors = this.get(`errors.${key}`) || [];
        response[key] = errors.mapBy('message');
        return response;
      }, {});
    }
  ),
});
