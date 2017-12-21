import Ember from 'ember';

import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';
import config from 'prison-rideshare-ui/config/environment';

import RSVP from 'rsvp';
import { makeArray } from '@ember/array';
import { isEmpty } from '@ember/utils';
import { run } from '@ember/runloop';
import {
  merge,
  assign as emberAssign
} from '@ember/polyfills';

const assign = emberAssign || merge;

export default OAuth2PasswordGrant.extend({
  serverTokenEndpoint: `${(Ember.testing ? '' : config.DS.host)}/${config.DS.namespace}/people/token`,

  // FIXME this is overkill maybe???
  authenticate(magicToken, scope = [], headers = {}) {
    return new RSVP.Promise((resolve, reject) => {
      const data = { 'grant_type': 'magic', token: magicToken };
      const serverTokenEndpoint = this.get('serverTokenEndpoint');
      const useResponse = this.get('rejectWithResponse');
      const scopesString = makeArray(scope).join(' ');
      if (!isEmpty(scopesString)) {
        data.scope = scopesString;
      }
      this.makeRequest(serverTokenEndpoint, data, headers).then((response) => {
        run(() => {
          if (!this._validate(response)) {
            reject('access_token is missing in server response');
          }

          const expiresAt = this._absolutizeExpirationTime(response['expires_in']);
          this._scheduleAccessTokenRefresh(response['expires_in'], expiresAt, response['refresh_token']);
          if (!isEmpty(expiresAt)) {
            response = assign(response, { 'expires_at': expiresAt });
          }

          resolve(response);
        });
      }, (response) => {
        run(null, reject, useResponse ? response : (response.responseJSON || response.responseText));
      });
    });
  },
});
