import Controller from '@ember/controller';
import BufferedProxy from 'ember-buffered-proxy/proxy';
import { inject as service } from '@ember/service';

export default Controller.extend({
  store: service(),

  showInactive: false,

  actions: {
    newPerson() {
      this.set(
        'editingPerson',
        BufferedProxy.create({
          content: this.store.createRecord('person'),
        })
      );
    },

    editPerson(person) {
      const proxy = BufferedProxy.create({ content: person });

      this.set('editingPerson', proxy);
    },

    savePerson() {
      const proxy = this.editingPerson;
      proxy.applyBufferedChanges();
      return proxy
        .get('content')
        .save()
        .then(() => this.set('editingPerson', undefined))
        .catch(() => {
          // FIXME this is handled for ride-saving failures, how to generalise?
        });
    },

    cancelPerson() {
      const model = this.get('editingPerson.content');

      if (model.get('isNew')) {
        model.destroyRecord();
      }

      this.set('editingPerson', undefined);
    },
  },
});
