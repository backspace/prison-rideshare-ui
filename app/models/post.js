import { computed, get } from '@ember/object';
import DS from 'ember-data';

export default DS.Model.extend({
  body: DS.attr({ defaultValue: '{"version": "0.3.1", "atoms": [], "cards": [], "markups": [], "sections": []}' }),

  bodyJson: computed('body', {
    get() {
      return JSON.parse(this.get('body'));
    },

    set(key, value) {
      this.set('body', JSON.stringify(value));
      return value;
    }
  }),

  poster: DS.belongsTo('user'),

  insertedAt: DS.attr('date'),

  validationErrors: computed('errors.[]', function () {
    const attributes = get(this.constructor, 'attributes');
    return attributes._keys.list.reduce((response, key) => {
      const errors = this.get(`errors.${key}`) || [];
      response[key] = errors.mapBy('message');
      return response;
    }, {});
  })
});
