import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import Controller from '@ember/controller';

@classic
export default class DebtsController extends Controller {
  @action
  reimburse(debt) {
    return debt.destroyRecord();
  }
}
