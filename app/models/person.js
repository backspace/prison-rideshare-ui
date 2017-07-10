import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),

  reimbursements: DS.hasMany(),

  drivings: DS.hasMany('ride', {inverse: 'driver'}),
  carOwnings: DS.hasMany('ride', {inverse: 'carOwner'}),

  validationErrors: Ember.computed('errors.[]', function() {
    const attributes = Ember.get(this.constructor, 'attributes');

    return attributes._keys.list.reduce((response, key) => {
      const errors = this.get(`errors.${key}`) || [];
      response[key] = errors.mapBy('message');
      return response;
    }, {});
  }),
});
