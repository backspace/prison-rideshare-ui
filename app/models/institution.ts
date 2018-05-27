import { computed, get } from '@ember/object';
import DS from 'ember-data';
import dollars from 'prison-rideshare-ui/utils/dollars';

export default class Institution extends DS.Model.extend({
  name: DS.attr(),
  rate: DS.attr('number', {defaultValue: 0}),

  rateDollars: dollars('rate'),

  validationErrors: computed('errors.[]', function() {
    const attributes = get(this.constructor, 'attributes');

    return attributes._keys.list.reduce((response: ValidationDictionary, key: string) => {
      const errors = this.get(`errors.${key}`) || [];
      response[key] = errors.mapBy('message');
      return response;
    }, {});
  })
}) {}

declare module 'ember-data' {
  interface ModelRegistry {
    institution: Institution
  }
}
