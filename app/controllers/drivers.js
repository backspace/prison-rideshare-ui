import Controller from '@ember/controller';
import BufferedProxy from 'ember-buffered-proxy/proxy';

export default Controller.extend({
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
      const proxy = this.get('editingPerson');
      proxy.applyBufferedChanges();
      return proxy
        .get('content')
        .save()
        .then(() => this.set('editingPerson', undefined))
        .catch(() => {});
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
