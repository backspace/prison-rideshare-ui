import Ember from 'ember';
import BufferedProxy from 'ember-buffered-proxy/proxy';

export default Ember.Controller.extend({
  actions: {
    addReimbursement(person) {
      const reimbursement = this.store.createRecord('reimbursement');
      const proxy = BufferedProxy.create({content: reimbursement});

      proxy.set('person', person);
      proxy.set('amountDollars', person.get('owedDollars'));

      this.set('editingReimbursement', proxy);
    },

    submit() {
      const proxy = this.get('editingReimbursement');
      proxy.applyBufferedChanges();
      return proxy.get('content').save().then(() => this.set('editingReimbursement', undefined));
    },

    cancel() {
      const proxy = this.get('editingReimbursement');
      proxy.get('content').destroyRecord();

      this.set('editingReimbursement', undefined);
    }
  }
});
