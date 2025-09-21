import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

@classic
export default class UsersController extends Controller {
  @service
  session;

  @action
  updateUserAdmin(user, admin) {
    user.set('admin', admin);
    user.save();
  }
}
