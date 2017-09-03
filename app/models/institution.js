import Ember from 'ember';
import DS from 'ember-data';
import dollars from 'prison-rideshare-ui/utils/dollars';

export default DS.Model.extend({
  name: DS.attr(),
  rate: DS.attr('number'),

  rateDollars: dollars('rate'),

  validationErrors: Ember.computed('errors.[]', function() {
    const attributes = Ember.get(this.constructor, 'attributes');

    return attributes._keys.list.reduce((response, key) => {
      const errors = this.get(`errors.${key}`) || [];
      response[key] = errors.mapBy('message');
      return response;
    }, {});
  })
});
