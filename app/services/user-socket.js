import PhoenixSocket from 'phoenix/services/phoenix-socket';
import Ember from 'ember';
import config from '../config/environment';

export default PhoenixSocket.extend({
  session: Ember.inject.service('session'),

  init() {
    this.set('present', Ember.A());
    this.connect();
  },

  connect() {
    if (Ember.testing) {
      return;
    }
    const guardian_token = this.get('session.data.authenticated.access_token');

    this._super(`${config.DS.socketHost}/socket`, {
      params: {guardian_token, email: this.get('session.currentUser.email')}
    });

    // TODO is this a sensible channel name?
    const channel = this.joinChannel('user:presence');

    channel.on('presence_state', (presenceState) => this._onPresenceState(presenceState));
    channel.on('presence_diff', (presenceDiff) => this._onPresenceDiff(presenceDiff));
  },

  _onPresenceState(users) {
    Object.keys(users).map(stringWithPrefix => this._parseUserString(stringWithPrefix)).forEach(id => this.get('present').pushObject(id));
  },

  _onPresenceDiff({leaves, joins}) {
    const joinIds = Object.keys(joins).map(stringWithPrefix => this._parseUserString(stringWithPrefix));
    const leaveIds = Object.keys(leaves).map(stringWithPrefix => this._parseUserString(stringWithPrefix));

    const present = this.get('present');

    joinIds.forEach(joinId => present.pushObject(joinId));
    leaveIds.forEach(leaveId => present.removeObject(leaveId));
  },

  _parseUserString(stringWithPrefix) {
    return stringWithPrefix.split(':')[1];
  }
});
