import Ember from 'ember';
import BufferedProxy from 'ember-buffered-proxy/proxy';

export default Ember.Controller.extend({
  actions: {
    editReimbursement(reimbursement) {
      const proxy = BufferedProxy.create({content: reimbursement});

      this.set('editingReimbursement', proxy);
    },

    submit() {
      const proxy = this.get('editingReimbursement');
      proxy.applyBufferedChanges();
      return proxy.get('content').save().then(() => this.set('editingReimbursement', undefined));
    },

    cancel() {
      this.set('editingReimbursement', undefined);
    }
  }
});
