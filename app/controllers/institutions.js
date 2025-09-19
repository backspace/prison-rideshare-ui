/* eslint-disable ember/no-actions-hash, ember/no-classic-classes, ember/no-get */
import Controller from '@ember/controller';
import BufferedProxy from 'ember-buffered-proxy/proxy';
import { inject as service } from '@ember/service';

export default Controller.extend({
  store: service(),

  actions: {
    newInstitution() {
      this.set(
        'editingInstitution',
        BufferedProxy.create({
          content: this.store.createRecord('institution'),
        })
      );
    },

    editInstitution(institution) {
      const proxy = BufferedProxy.create({ content: institution });

      this.set('editingInstitution', proxy);
    },

    saveInstitution() {
      const proxy = this.editingInstitution;
      proxy.applyBufferedChanges();
      return proxy
        .get('content')
        .save()
        .then(() => this.set('editingInstitution', undefined))
        .catch(() => {});
    },

    cancelInstitution() {
      const model = this.get('editingInstitution.content');

      if (model.get('isNew')) {
        model.destroyRecord();
      }

      this.set('editingInstitution', undefined);
    },
  },
});
