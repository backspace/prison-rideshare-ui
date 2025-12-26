import SessionService from 'ember-simple-auth/services/session';
import { tracked } from '@glimmer/tracking';

export default class Session extends SessionService {
  @tracked currentUser;
}
