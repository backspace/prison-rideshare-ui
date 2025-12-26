import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';
import config from 'prison-rideshare-ui/config/environment';

export default class Application extends OAuth2PasswordGrant {
  serverTokenEndpoint = `${config.DS.host || ''}/${config.DS.namespace}/token`;
}
