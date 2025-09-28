/* eslint-disable ember/no-classic-classes, ember/no-get*/
import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Model.extend({
  userSocket: service(),

  email: attr('string'),
  password: attr('string'),
  passwordConfirmation: attr('string'),

  admin: attr('boolean'),

  lastSeenAt: attr('date'),

  isPresent: computed.gt('presenceCount', 0),

  // TODO restore in #202
  presenceCount: 0,

  // presenceCount: computed('id', 'userSocket.present.length', function () {
  //   const myId = this.id;
  //   return this.get('userSocket.present').filter((id) => myId === id).length;
  // }),
});
