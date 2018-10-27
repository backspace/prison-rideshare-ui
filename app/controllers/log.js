import Controller from '@ember/controller';
import BufferedProxy from 'ember-buffered-proxy/proxy';

export default Controller.extend({
  actions: {
    newPost() {
      this.set('editingPost', BufferedProxy.create({
        content: this.store.createRecord('post')
      }));
    },

    savePost() {
      const proxy = this.get('editingPost');
      proxy.applyBufferedChanges();
      return proxy.get('content').save().then(() => this.set('editingPost', undefined))
        .catch(() => { });
    },

    cancelPost() {

    }
  }
});
