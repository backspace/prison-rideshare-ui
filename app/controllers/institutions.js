import Controller from '@ember/controller';
import BufferedProxy from 'ember-buffered-proxy/proxy';

export default Controller.extend({
  actions: {
    newInstitution() {
      this.set('editingInstitution', BufferedProxy.create({
        content: this.store.createRecord('institution')
      }));
    },

    editInstitution(institution) {
      const proxy = BufferedProxy.create({content: institution});

      this.set('editingInstitution', proxy);
    },

    saveInstitution() {
      const proxy = this.get('editingInstitution');
      proxy.applyBufferedChanges();
      return proxy.get('content').save().then(() => this.set('editingInstitution', undefined))
        .catch(() => {});
    },

    cancelInstitution() {
      const model = this.get('editingInstitution.content');

      if (model.get('isNew')) {
        model.destroyRecord();
      }

      this.set('editingInstitution', undefined);
    }
  }
});
