/* eslint-disable ember/no-classic-classes, ember/no-get */
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

  @service
  postReadings;

  @action
  newPost() {
    this.set(
      'editingPost',
      BufferedProxy.create({
        content: this.store.createRecord('post'),
      }),
    );
  }

  @action
  editPost(post) {
    const proxy = BufferedProxy.create({ content: post });

    this.set('editingPost', proxy);
  }

  @action
  updatePostBody(body) {
    this.editingPost.set('body', JSON.stringify(body));
  }

  @action
  savePost(event) {
    event?.preventDefault?.();

    const proxy = this.editingPost;
    proxy.applyBufferedChanges();
    return proxy
      .get('content')
      .save()
      .then(() => this.set('editingPost', undefined))
      .catch(() => {});
  }

  @action
  cancelPost(event) {
    event?.preventDefault?.();

    const model = this.get('editingPost.content');

    if (model.get('isNew')) {
      model.destroyRecord();
    }

    this.set('editingPost', undefined);
  }

  @action
  maybeDeletePost(post) {
    this.set('deletingPost', post);
  }

  @action
  deletePost() {
    return this.deletingPost.destroyRecord();
  }

  @action
  markAllRead() {
    return this.postReadings.markAllRead();
  }

  @action
  markRead(post) {
    return this.postReadings.markRead(post);
  }

  @action
  markUnread(post) {
    return this.postReadings.markUnread(post);
  }
}
