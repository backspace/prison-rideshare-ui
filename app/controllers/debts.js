import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    reimburse(debt) {
      return debt.destroyRecord();
    }
  }
});
