import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  userSocket: Ember.inject.service(),

  email: DS.attr('string'),
  password: DS.attr('string'),
  passwordConfirmation: DS.attr('string'),

  admin: DS.attr('boolean'),

  isPresent: Ember.computed('presenceCount', function() {
    return this.get('presenceCount') > 0;
  }),

  presenceCount: Ember.computed('userSocket.present.length', function() {
    const myId = this.get('id');
    return this.get('userSocket.present').filter(id => myId === id).length;
  })
});
