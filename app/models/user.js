import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import DS from 'ember-data';

export default DS.Model.extend({
  userSocket: service(),

  email: DS.attr('string'),
  password: DS.attr('string'),
  passwordConfirmation: DS.attr('string'),

  admin: DS.attr('boolean'),

  isPresent: computed('presenceCount', function() {
    return this.get('presenceCount') > 0;
  }),

  presenceCount: computed('userSocket.present.length', function() {
    const myId = this.get('id');
    return this.get('userSocket.present').filter(id => myId === id).length;
  }),
});
