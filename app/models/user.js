import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import DS from 'ember-data';

export default DS.Model.extend({
  userSocket: service(),

  email: DS.attr('string'),
  password: DS.attr('string'),
  passwordConfirmation: DS.attr('string'),

  admin: DS.attr('boolean'),

  lastSeenAt: DS.attr('date'),

  isPresent: computed.gt('presenceCount', 0),

  presenceCount: computed('id', 'userSocket.present.length', function () {
    const myId = this.id;
    return this.get('userSocket.present').filter((id) => myId === id).length;
  }),
});
