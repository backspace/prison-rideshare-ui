import OAuth2Bearer from 'ember-simple-auth/authorizers/oauth2-bearer';
import { isEmpty } from '@ember/utils';

export default OAuth2Bearer.extend({
  authorize(data, block) {
    const accessToken = 'XXX';

    if (!isEmpty(accessToken)) {
      block('Authorization', `Person Bearer ${accessToken}`);
    }
  }
});
