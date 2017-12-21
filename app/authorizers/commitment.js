import OAuth2Bearer from 'ember-simple-auth/authorizers/oauth2-bearer';
import { isEmpty } from '@ember/utils';

export default OAuth2Bearer.extend({
  authorize(data, block) {
    // FIXME what if the access token is for the application authenticator???
    const accessToken = data['access_token'];

    if (!isEmpty(accessToken)) {
      block('Authorization', `Person Bearer ${accessToken}`);
    }
  }
});
