import Ember from 'ember';
import BufferedProxy from 'ember-buffered-proxy/proxy';

export default Ember.Controller.extend({
  actions: {
    // Parts of this will likely be useful in the reimbursements controller
    // addReimbursement(person) {
    //   const reimbursement = this.store.createRecord('reimbursement');
    //   const proxy = BufferedProxy.create({content: reimbursement});
    //
    //   proxy.set('person', person);
    //   proxy.set('amountDollars', person.get('owedDollars'));
    //
    //   this.set('editingReimbursement', proxy);
    // },
    //
    // submit() {
    //   const proxy = this.get('editingReimbursement');
    //   proxy.applyBufferedChanges();
    //   return proxy.get('content').save().then(() => this.set('editingReimbursement', undefined));
    // },
    //
    // cancel() {
    //   const proxy = this.get('editingReimbursement');
    //   proxy.get('content').destroyRecord();
    //
    //   this.set('editingReimbursement', undefined);
    // },

    newPerson() {
      this.set('editingPerson', BufferedProxy.create({
        content: this.store.createRecord('person')
      }));
    },

    editPerson(person) {
      const proxy = BufferedProxy.create({content: person});

      this.set('editingPerson', proxy);
    },

    savePerson() {
      const proxy = this.get('editingPerson');
      proxy.applyBufferedChanges();
      return proxy.get('content').save().then(() => this.set('editingPerson', undefined));
    },

    cancelPerson() {
      const model = this.get('editingPerson.content');

      if (model.get('isNew')) {
        model.destroyRecord();
      }

      this.set('editingPerson', undefined);
    }
  }
});
