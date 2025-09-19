import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import PhoenixSocket from 'ember-phoenix/services/phoenix-socket';
import Ember from 'ember';
import config from '../config/environment';

export default PhoenixSocket.extend({
  session: service('session'),

  init() {
    this._super(...arguments);
    this.set('present', A());
    this.connect();
  },

  connect() {
    if (Ember.testing || !this.get('session.isAuthenticated')) {
      return;
    }

    const guardian_token = this.get('session.data.authenticated.access_token');

    this._super(`${config.DS.socketHost}/socket`, {
      params: { guardian_token },
    });

    // TODO is this a sensible channel name?
    const channel = this.joinChannel('user:presence');

    channel.on('presence_state', (presenceState) =>
      this._onPresenceState(presenceState)
    );
    channel.on('presence_diff', (presenceDiff) =>
      this._onPresenceDiff(presenceDiff)
    );
  },

  _onPresenceState(users) {
    this._processJoins(Object.keys(users));
  },

  _onPresenceDiff({ leaves, joins }) {
    this._processJoins(Object.keys(joins));
    this._processLeaves(Object.keys(leaves));
  },

  _processJoins(keys) {
    const present = this.present;
    keys
      .map((stringWithPrefix) => this._parseUserString(stringWithPrefix))
      .forEach((joinId) => {
        if (!present.includes(joinId)) {
          present.pushObject(joinId);
        }
      });
  },

  _processLeaves(keys) {
    const present = this.present;
    keys
      .map((stringWithPrefix) => this._parseUserString(stringWithPrefix))
      .forEach((leaveId) => present.removeObject(leaveId));
  },

  _parseUserString(stringWithPrefix) {
    return stringWithPrefix.split(':')[1];
  },
});
