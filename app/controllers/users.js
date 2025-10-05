import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default class UsersController extends Controller {
  @service
  session;

  @action
  updateUserAdmin(user, event) {
    const admin = event?.target?.checked;

    user.set('admin', admin);
    user.save();
  }
}
