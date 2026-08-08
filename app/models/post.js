/* eslint-disable ember/no-classic-classes*/
import Model, { attr, belongsTo } from '@ember-data/model';
import { computed } from '@ember/object';

export default Model.extend({
  // Markdown
  body: attr('string'),
  unread: attr('boolean'),

  poster: belongsTo('user', { async: true, inverse: null }),

  insertedAt: attr('date'),

  validationErrors: computed(
    'constructor.attributes',
    'errors.[]',
    function () {
      const attributes = this.constructor.attributes;
      return Array.from(attributes.keys()).reduce((response, key) => {
        const errors = this.get(`errors.${key}`) || [];
        response[key] = errors.map((e) => e.message);
        return response;
      }, {});
    },
  ),
});
