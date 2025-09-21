/* eslint-disable ember/no-actions-hash, ember/no-classic-classes, ember/no-get */
import Controller from '@ember/controller';
import BufferedProxy from 'ember-buffered-proxy/proxy';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),
  store: service(),

  actions: {
    newPost() {
      this.set(
        'editingPost',
        BufferedProxy.create({
          content: this.store.createRecord('post'),
        })
      );
    },

    editPost(post) {
      const proxy = BufferedProxy.create({ content: post });

      this.set('editingPost', proxy);
    },

    savePost() {
      const proxy = this.editingPost;
      proxy.applyBufferedChanges();
      return proxy
        .get('content')
        .save()
        .then(() => this.set('editingPost', undefined))
        .catch(() => {});
    },

    cancelPost() {
      const model = this.get('editingPost.content');

      if (model.get('isNew')) {
        model.destroyRecord();
      }

      this.set('editingPost', undefined);
    },

    deletePost() {
      return this.deletingPost.destroyRecord();
    },

    markAllRead() {
      this.get('model.firstObject').markAllRead();
    },

    markRead(post) {
      return post.markRead();
    },

    markUnread(post) {
      return post.markUnread();
    },
  },
});
