import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import Service from '@ember/service';
import { inject as service } from '@ember/service';

import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';

@classic
class ObjectPromiseProxy extends ObjectProxy.extend(PromiseProxyMixin) {}

@classic
export default class SidebarService extends Service {
  @service
  overlaps;

  @service
  store;

  @service
  userSocket;

  open = false;

  @computed('userSocket.present.length')
  get userCount() {
    const count = this.get('userSocket.present.length');

    if (count > 1) {
      return count;
    } else {
      return 0;
    }
  }

  @computed
  get postsRequest() {
    return ObjectPromiseProxy.create({
      promise: this.store.findAll('post').then((posts) => {
        return {
          posts,
        };
      }),
    });
  }

  @computed('postsRequest.posts.@each.unread')
  get unreadCount() {
    let posts = this.get('postsRequest.posts');

    if (posts) {
      return posts.filterBy('unread').length;
    } else {
      return 0;
    }
  }

  @computed('userCount', 'unreadCount', 'overlaps.count')
  get notificationCount() {
    // TODO this is untested
    return this.userCount + this.unreadCount + this.get('overlaps.count');
  }
}
