/* eslint-disable ember/no-actions-hash, ember/no-classic-classes */
import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    reimburse(debt) {
      return debt.destroyRecord();
    },
  },
});
