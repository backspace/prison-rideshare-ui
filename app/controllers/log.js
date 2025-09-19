import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import BufferedProxy from 'ember-buffered-proxy/proxy';

@classic
export default class LogController extends Controller {
  @service
  session;

  @service
  store;

  @action
  newPost() {
    this.set(
      'editingPost',
      BufferedProxy.create({
        content: this.store.createRecord('post'),
      })
    );
  }

  @action
  editPost(post) {
    const proxy = BufferedProxy.create({ content: post });

    this.set('editingPost', proxy);
  }

  @action
  savePost() {
    const proxy = this.editingPost;
    proxy.applyBufferedChanges();
    return proxy
      .get('content')
      .save()
      .then(() => this.set('editingPost', undefined))
      .catch(() => {});
  }

  @action
  cancelPost() {
    const model = this.get('editingPost.content');

    if (model.get('isNew')) {
      model.destroyRecord();
    }

    this.set('editingPost', undefined);
  }

  @action
  deletePost() {
    return this.deletingPost.destroyRecord();
  }

  @action
  markAllRead() {
    this.get('model.firstObject').markAllRead();
  }

  @action
  markRead(post) {
    return post.markRead();
  }

  @action
  markUnread(post) {
    return post.markUnread();
  }
}
