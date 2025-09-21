import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
/* eslint-disable ember/no-actions-hash, ember/no-classic-classes */
import Controller from '@ember/controller';

@classic
export default class DebtsController extends Controller {
  @action
  reimburse(debt) {
    return debt.destroyRecord();
  }
}
