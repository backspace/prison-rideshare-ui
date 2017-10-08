import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  userSocket: Ember.inject.service(),

  email: DS.attr('string'),
  password: DS.attr('string'),
  passwordConfirmation: DS.attr('string'),

  admin: DS.attr('boolean'),

  isPresent: Ember.computed('userSocket.present.length', function() {
    return this.get('userSocket.present').includes(this.get('id'));
  })
});
